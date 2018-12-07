'use strict';

const transactionRepository = require("./TransactionsRepository");
const utils = require("./Utils");

const transferMoney = async (userId, fromSpace, toSpace, amountToTransfer) => {

    let fromUpdatedBalance, toUpdatedBalance;

    // from logic
    try {
        const data = await transactionRepository.getBalance(userId, fromSpace);
        const currentBalance = data.Item.amount;

        if (amountToTransfer > currentBalance)
            return utils.getIntentResponse("Insufficient balance in " + fromSpace + " space");

        fromUpdatedBalance = currentBalance - amountToTransfer;
    } catch (error) {
        return utils.getIntentResponse("Error while getting balance in " + fromSpace + " space");
    }

    // to logic
    try {
        const data = await transactionRepository.getBalance(userId, toSpace);
        const currentBalance = data.Item.amount;
        toUpdatedBalance = currentBalance + amountToTransfer;
    } catch (error) {
        return utils.getIntentResponse("Error while getting balance in " + toSpace + " space");
    }

    try {
        await transactionRepository.batchCreateTransaction(userId, fromSpace, toSpace, fromUpdatedBalance, toUpdatedBalance);
        return utils.getIntentResponse("Moved money between spaces");
    } catch (error) {
        return utils.getIntentResponse("Error while moving money from " + fromSpace + " to " + toSpace);
    }
};

const createTxn = async (userId, space, txnTag, amount) => {

    let balanceToUpdate;

    //TODO: If no balance present create new one
    try {
        const data = await transactionRepository.getBalance(userId, space);
        const currentBalance = data.Item.amount;
        balanceToUpdate = currentBalance + amount;
    } catch (error) {
        console.log("Balance does exist for user");
        balanceToUpdate = amount;
    }

    try {
        await transactionRepository.createTxn(userId, space, balanceToUpdate);
        await transactionRepository.sendToQueue(userId, space, txnTag, amount);
        return utils.getHttpResponse(200, {"message": "success"});
    } catch (error) {
        console.log(JSON.stringify(error));
        return utils.getHttpResponse(500, error)
    }
};

const getBalances = async (userId) => {
    try {
        const data = await transactionRepository.getBalances(userId);
        let items = data.Items;
        let r = {
            main: 0,
            saving: 0,
            travel: 0,
            gift: 0
        };
        for (let item of items) {
            if(item.spaceName === 'main') {
                r['main'] = item.amount;
            }
            if(item.spaceName === 'saving') {
                r['saving'] = item.amount;
            }
            if(item.spaceName === 'travel') {
                r['travel'] = item.amount;
            }
            if(item.spaceName === 'gift') {
                r['gift'] = item.amount;
            }
        }
        const response = JSON.stringify(r);
        return {statusCode: 200, body: response};
    } catch (error) {
        return utils.getHttpResponse(500, error)
    }
};

module.exports = {
    transferMoney,
    createTxn,
    getBalances
};
