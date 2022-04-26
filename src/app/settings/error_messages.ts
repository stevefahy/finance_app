export interface ErrorMessages {
  error: string;
  message: string;
  params?: string;
  action?: 'dialog' | 'inline';
}

export const ERROR_MESSAGES: ErrorMessages[] = [
  {
    error: 'mcurrency_error_general',
    message: 'Error Loading Currency data.',
    action: 'dialog',
  },
  {
    error: 'mcurrency_error_nocurrency_found',
    message: 'Currency not found.',
    action: 'dialog',
  },
  {
    error: 'mstock_error_general',
    message: 'Error loading Stock data.',
    action: 'dialog',
  },
  {
    error: 'mstock_error_no_stock_found',
    message: 'Stock not found.',
    action: 'dialog',
  },
  {
    error: 'mstock_error_limit',
    message: 'Stock API linit exceeded.',
    action: 'dialog',
  },
  {
    error: 'login_error_password',
    message:
      'Sorry, your password was incorrect.\r\n Please double-check your password.',
    action: 'inline',
  },
  {
    error: 'login_error_password_general',
    message:
      'Sorry, your password was incorrect.\r\n Please double-check your password.',
    action: 'inline',
  },
  {
    error: 'login_error_username',
    message:
      "The username that you've entered doesn't belong to an account.\r\n Please check your username and try again.",
    action: 'inline',
  },
  {
    error: 'login_error_username_general',
    message:
      "The username that you've entered doesn't belong to an account.\r\n Please check your username and try again.",
    action: 'inline',
  },
  {
    error: 'signup_error_username_general',
    message: "This username isn't available. Please try another.",
    action: 'inline',
  },
  {
    error: 'signup_error_username',
    message: "This username isn't available. Please try another.",
    action: 'inline',
  },
  {
    error: 'signup_error_password_general',
    message: 'Please try creating a different password.',
    action: 'inline',
  },
];
