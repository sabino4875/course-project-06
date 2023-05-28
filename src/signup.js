const aws = require('aws-sdk');
const cognito = new aws.CognitoIdentityServiceProvider()
const { sendResponseMessage, validateSignupLogin } = require("./helper");

const signup = async (event) => {
    try {

        const isValid = validateSignupLogin(event.body)
        if (!isValid){
            return sendResponseMessage(400, { message: 'Verifique os campos informados.' });
        }

        const body = JSON.parse(event.body);
        const { email, password } = body
        const { user_pool_id } = process.env

        const params = {
            UserPoolId: user_pool_id,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                }],
            MessageAction: 'SUPPRESS'
        }
        const response = await cognito.adminCreateUser(params).promise();
        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: user_pool_id,
                Username: email,
                Permanent: true
            };
            await cognito.adminSetUserPassword(paramsForSetPass).promise()
        }
        return  sendResponseMessage(200, { message: 'Usuário cadastrado com sucesso.' });
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error';
        return  sendResponseMessage(400, { message: message });
    }
};
    
    
module.exports = {
    handler:signup
}
        