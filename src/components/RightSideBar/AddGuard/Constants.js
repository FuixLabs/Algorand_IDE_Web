const Constants = {
    content: [
        {
            title: 'Expressions',
            description: [
                `Expressions allow you to harness the power of JavaScript in your
                prototypes. They let you manipulate variables, perform math and logic
                operations and use the results to take further actions in the prototype.
                You can use arithmetic, trigonometry and other types of functions
                borrowed from JavaScript, like string or date functions. Use expressions
                whenever you need to create computational components (such as shopping
                carts) or to validate data provided by users, for example, to check if a
                password meets certain criteria.`,
                `Since expressions are a part of interactions, you can use them for
                setting the content of elements, creating conditions or performing
                operations on variables.`,
            ],
        },
        {
            title: 'Writing expressions',
            typeDes: 'list',
            description: [
                'String: use single quote (Ex: `’This is a string’`)',
                'Integer: integer number literal (Ex: `1`, `69`, `-42`)',
                'Boolean: boolean literal (Ex: `True`, `False`)',
                ' Variable: variables that contained value of 4 above data types (Ex:' + '`n`, `money`, `numAccount`)',
                `Function — any of the supported functions e.g. substr(string, start,
                    end);`,
            ],
            ex: ['!isEmpty(address) and money > 0'],
        },
        {
            title: 'Common functions',
            description: [
                ` Expressions include a variety of functions which can be used in
                different scenarios. However, in the majority of cases, you need to use
                a combination of the most common functions to achieve the desired
                effects.`,
            ],
        },
    ],
};

export default Constants;
