const Example = [
    {
        id: '4f0c1e40588ca6737b99c633a522c519c8ded7ae',
        type: 'default',
        position: {
            x: 180.60998189687422,
            y: 114.17260126735574,
        },
        data: {
            label: 'Register 1',
            type: [
                {
                    value: 'STRING',
                },
                {
                    value: 'STRING',
                },
                {
                    value: 'STRING',
                },
                {
                    value: 'STRING',
                },
            ],
            guard: '',
            typeBlock: 'register',
            icon: '/static/media/register.f7fe0a50.svg',
            allowAddData: true,
        },
        className: 'register WorkBoard-block-3',
    },
    {
        id: '7a58604e75e61c44bcd3914cd9c1124f13fcb9b1',
        type: 'default',
        position: {
            x: 527.0562276533121,
            y: 115.98790224038163,
        },
        data: {
            label: 'Register 2',
            type: [
                {
                    value: 'STRING',
                },
                {
                    value: 'STRING',
                },
                {
                    value: 'INT',
                },
            ],
            guard: '',
            typeBlock: 'register',
            icon: '/static/media/register.f7fe0a50.svg',
            allowAddData: true,
            markings: [],
        },
        className: 'register WorkBoard-block-3',
    },
    {
        id: 'b62d9ca17886bfe33173628d0032c8b292be621a',
        type: 'default',
        position: {
            x: 344.7387961078964,
            y: 263.1807807195547,
        },
        data: {
            label: 'Operation',
            type: [{}],
            guard: '(price < 500)',
            typeBlock: 'operation',
            icon: '/static/media/operation.d4be570a.svg',
        },
        className: 'operation WorkBoard-block-3',
    },
    {
        id: '1d6d4a291584be0c0f29ee50f6cc8606b2979d19',
        type: 'default',
        position: {
            x: 343.75481217493416,
            y: 388.70710681118123,
        },
        data: {
            label: 'Register 3',
            type: [
                {
                    value: 'STRING',
                },
                {
                    value: 'STRING',
                },
                {
                    value: 'STRING',
                },
                {
                    value: 'STRING',
                },
                {
                    value: 'INT',
                },
            ],
            guard: '',
            typeBlock: 'register',
            icon: '/static/media/register.f7fe0a50.svg',
        },
        className: 'register WorkBoard-block-3',
    },
    {
        id: 'reactflow__edge-b62d9ca17886bfe33173628d0032c8b292be621anull-1d6d4a291584be0c0f29ee50f6cc8606b2979d19null',
        source: 'b62d9ca17886bfe33173628d0032c8b292be621a',
        target: '1d6d4a291584be0c0f29ee50f6cc8606b2979d19',
        type: 'default',
        data: {
            typeBlock: 'connection',
            variables: [],
            expressions: [
                {
                    value: 'transactionID',
                },
                {
                    value: 'name',
                },
                {
                    value: 'exp_date',
                },
                {
                    value: 'status',
                },
                {
                    value: 'price',
                },
            ],
            label: 'Expression',
        },
        animated: false,
    },
    {
        id: 'reactflow__edge-4f0c1e40588ca6737b99c633a522c519c8ded7aenull-b62d9ca17886bfe33173628d0032c8b292be621anull',
        source: '4f0c1e40588ca6737b99c633a522c519c8ded7ae',
        target: 'b62d9ca17886bfe33173628d0032c8b292be621a',
        type: 'default',
        data: {
            typeBlock: 'connection',
            variables: [
                {
                    value: 'transactionID',
                },
                {
                    value: 'name',
                },
                {
                    value: 'exp_date',
                },
                {
                    value: 'status',
                },
            ],
            expressions: [],
            label: 'Variable',
        },
        animated: false,
    },
    {
        id: 'reactflow__edge-7a58604e75e61c44bcd3914cd9c1124f13fcb9b1null-b62d9ca17886bfe33173628d0032c8b292be621anull',
        source: '7a58604e75e61c44bcd3914cd9c1124f13fcb9b1',
        target: 'b62d9ca17886bfe33173628d0032c8b292be621a',
        type: 'default',
        data: {
            typeBlock: 'connection',
            variables: [
                {
                    value: 'transactionID',
                },
                {
                    value: 'name',
                },
                {
                    value: 'price',
                },
            ],
            expressions: [],
            label: 'Variable',
        },
        animated: false,
    },
];
export default Example;
