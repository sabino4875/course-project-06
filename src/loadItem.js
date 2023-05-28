"use strict";
const aws = require("aws-sdk");
const { sendResponseMessage } = require("./helper");

const loadItem = async (event) => {
    const dynamodb = new aws.DynamoDB.DocumentClient();
    const {id} = event.pathParameters
    let item;

    try {
        const result = await dynamodb.get({
            TableName: "ProductTable",
            Key: {id}
        }).promise();
        item = result.Item;
    } catch (error) {
        console.log(error)
        return sendResponseMessage(400, error);
    }

    return sendResponseMessage(200, item);
};

module.exports = {
    handler: loadItem,
};
