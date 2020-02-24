// 动态路由
import request from '@/utils/request'
import Layout from '@/layout'
import { construct } from '@aximario/json-tree'

async function parseMenu(id) {
  const response = await request.get('/baseUser/findMenuByUserId?id=' + id)
  const privileges = construct(response.data, {
    id: 'id',
    pid: 'parentId',
    children: 'children'
  })
  const routes = []
  for (const privilege of privileges) {
    if (privilege.type === 'menu') {
      const route = {
        path: privilege.route,
        component: Layout,
        meta: { title: privilege.name, icon: privilege.icon, affix: true },
        children: []
      }
      if (privilege.children && privilege.children.length > 0) {
        for (const p of privilege.children) {
          const son_route = {
            path: p.route,
            // component: () => import('@/pages'+p.route),
            component: function component(resolve) {
              require(['@/pages' + p.route], resolve)
            },
            name: p.route.replace(/\//g, '_'),
            meta: { title: p.name, affix: true },
            hidden: p.hidden == 1
          }
          console.log(JSON.stringify(son_route))
          route.children.push(son_route)
        }
      }
      routes.push(route)
    }
  }
  routes.push({ path: '*', redirect: '/404', hidden: true })
  return routes
}
// let routes = parseMenu();

export default parseMenu

