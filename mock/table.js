import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    _id: '@increment',
    sendTime: '@datetime',
    content: {
      'type|1': ['receive', 'send'],
      body: '@cparagraph(1,3) '
    },
    'status|1': ['已阅读', '未阅读', '1/1'],
    'origin|1': ['CPE引擎', '管理员'],
    'eventType|1': ['航班楼运行事件', '航班信息维护事件']
  }]
})

export default [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      const { page, count } = config.query
      const items = data.items.filter((item, index) => {
        return index > (page - 1) * count && index < page * count
      })
      return {
        code: 20000,
        data: {
          total: data.items.length,
          items: items
        }
      }
    }
  }
]
