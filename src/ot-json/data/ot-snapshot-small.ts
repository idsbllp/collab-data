export const snapshot = {
    type: '小型文档',
    object: {},
    blocks: [{
        type: 'page',
        id: '111',
        map: {
            id1: {
                type: 'heading',
                id: 'id1',
                children: ['id3'],
            },
        },
        children: ['id1', 'id2'],
    }],
};
