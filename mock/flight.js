import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    _id: '@increment',
    'level|1': ['VVIP-G', 'VIP-T', 'VVIP', 'VIP'],
    'status|1': ['进港', '出港'],
    'remind': '@natural(0,10)' + '小时' + '@natural(0,60)' + '分钟'
  }]
})

export default [
  {
    url: '/flight/list',
    type: 'get',
    response: config => {
      const { page, count, level, status } = config.query
      const itemsFilter = data.items.filter(item => {
        if (level && item.level !== level) {
          return false
        }
        if (status && item.status !== status) {
          return false
        }
        return true
      })

      const items = itemsFilter.filter((item, index) => {
        return index > (page - 1) * count && index < page * count
      })

      return {
        code: 20000,
        data: {
          total: itemsFilter.length,
          items: items
        }
      }
    }
  },

  {
    url: '/flight/add',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/flight/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
