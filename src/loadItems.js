"use strict";
const aws = require("aws-sdk");
const { sendResponseMessage } = require("./helper");

const loadItems = async (event) => {
    const dynamodb = new aws.DynamoDB.DocumentClient();
    let items;
    try {
        const results = await dynamodb.scan({
            TableName: "ProductTable"
        }).promise();
        items = results.Items;
    } catch (error) {
        console.log(error)
        return sendResponseMessage(400, error);
    }

    return sendResponseMessage(200, items);
};

module.exports = {
    handler: loadItems,
};
