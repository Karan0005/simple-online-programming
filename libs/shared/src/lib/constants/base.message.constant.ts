export const BaseMessage = {
    Exception: {
        Unauthorized: 'Unauthorized',
        AccessTokenExpired: 'AccessTokenExpired'
    },
    Error: {
        InvalidInput: 'Invalid input provided',
        SomethingWentWrong: 'Something went wrong.',
        BackendBootstrap: 'Backend bootstrapped failed.',
        BackendGeneral: 'Backend internal server error',
        DatabaseGeneral:
            'Error occurred at database layer, it might be because of invalid request body.',
        RouteNotFound: 'Cannot GET /',
        InvalidDateTimeFormat: 'Invalid date time, format must be YYYY-MM-DDTHH:mm:ss.SSSZ',
        InvalidDateFormat: 'Invalid date, format must be YYYY-MM-DD',
        InvalidNumber: 'Invalid number value',
        SecretKeyNotFound: 'Secret key not found'
    },
    Success: {
        RootRoute: (environment: string) =>
            `Backend application starts successfully for ${environment} environment`,
        BackendBootstrap: (url: string) =>
            `Backend bootstrapped successfully, open your browser on ${url}`,
        SuccessGeneral: 'Success',
        ServerStartUp: 'Application started on port number :: '
    },
    SwaggerMessage: {
        Property: {
            Description: {
                IsSuccess: 'Response status',
                Message: 'Response message',
                Data: 'Entity response',
                Errors: 'Response errors if any'
            }
        },
        Response: {
            Ok: {
                Status: 200,
                Description: 'Success response'
            },
            ServiceUnavailable: {
                Status: 503,
                Description: 'Service unavailable response.'
            }
        }
    },
    Information: {},
    Warning: {},
    Description: {}
};
