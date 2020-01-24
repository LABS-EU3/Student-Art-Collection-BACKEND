module.exports = {
    type: {
        FirstType: "login",
        secondType: "Reset Password"
    },
    intro: {
        first: 'You have received this email because you just signup at ArtFinder',
        second: 'You have received this email because a password reset request for your account was received.',
        third: "Your order has been processed successfully.",
        fourth: "There was a problem with your order"
    },
    instructions: {
        first:  'Click the button below to confirm your account',
        second: 'Click the button below to reset your password:'
    },
    button :{
        color: '#22BC66',
        text: {
            first: 'Confirm your account',
            second:'Reset your password',
        }
    },
    outro : {
        first: 'If you did not signup to ArtFinder, no further action is required on your part.',
        second:  'If you did not request a password reset, no further action is required on your part.',
        third: "Thank You for your purchase. The school will get in touch with you shortly to arrange collection of the item purchased.",
        fourth: "Your payment was nt succesful. Please try again."
    },
    subject : {
        first: "Confirm your email",
        second:  'Password Reset',
        third: "Customer Query",
        fourth: "Art Delivery - payment confirmed",
        fifth: "Art Delivery - payment was not succesful"
    }
}