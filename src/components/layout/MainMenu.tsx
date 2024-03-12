import { Button, Menu } from 'antd'
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  QuestionOutlined,
  PushpinOutlined,
  FlagOutlined,
  DatabaseOutlined,
  CloudDownloadOutlined,
  ApiFilled,
  DashboardOutlined,
  TagOutlined,
  ApiOutlined
} from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../config/routes'
import Parse from 'parse'

type MainMenuProps = {
  activeTab: string
}
const MainMenu = ({ activeTab }: MainMenuProps) => {
  const location = useLocation<Object>()
  const func = async (e) => {
    if (location.state != undefined) {

      if (location.state["changedstate"]) {
        if (location.pathname.startsWith("/what2study/home")) {
          // history.push('/updateState')
          localStorage.setItem("updated", "home");
          localStorage.setItem("updatedObj", JSON.stringify(location.state["unSavedObj"]));
        }
        if (location.pathname.startsWith("/what2study/generalOffersState") && location.state["parseRef"]) {
          // try {
          localStorage.setItem("updated", "generalOffersState");
          localStorage.setItem("updatedObj", JSON.stringify(location.state["unSavedObj"]));
          localStorage.setItem("id", location.state["parseRef"].id);
          localStorage.setItem("className", location.state["parseRef"].className);
        }
        if (location.pathname.startsWith("/what2study/intentsState") && location.state["parseRef"]) {
          // try {
          localStorage.setItem("updated", "intentsState");
          localStorage.setItem("updatedObj", JSON.stringify(location.state["unSavedObj"]));
          localStorage.setItem("id", location.state["parseRef"].id);
          localStorage.setItem("className", location.state["parseRef"].className);
        }
       
       
      }
    }
  }

  const user = Parse.User.current()
  const role: 'admin' | 'company' | undefined = user?.attributes.role
  return (
    < >
      <Menu style={{ position:"fixed", width:"200px", height:"inherit" }} onClick={() => { func({ e: Event }) }} defaultSelectedKeys={[activeTab]} mode='inline'>


          <Menu.Item key='4' style={{marginTop:"15px"}} icon={<ShopOutlined />}>
            <Link to={{ pathname: ROUTES.COMPANY_URL, state: { prevPath: location.pathname } }}> Allgemein</Link>
          </Menu.Item>
      
        <Menu.Item key='15' icon={<TeamOutlined />}>
          <Link to={{ pathname: ROUTES.General, state: { prevPath: location.pathname } }}>Chat-Client</Link>
        </Menu.Item>
        <Menu.Item key='1' icon={<ApiOutlined />}>
          <Link to={{ pathname: "/what2study/database", state: { prevPath: location.pathname } }} >Datenbank</Link>
        </Menu.Item>
        <Menu.Item key='5' icon={<TagOutlined />}>
          <Link to={{ pathname: ROUTES.Intents, state: { prevPath: location.pathname } }} >Szenarien</Link>
        </Menu.Item>
        <Menu.Item key='6' icon={<DashboardOutlined />}>
          <Link to={{ pathname: "/what2study/monitoring", state: { prevPath: location.pathname } }} >Monitoring</Link>
        </Menu.Item>
      
       </Menu>
    </>
  )
}

export default MainMenu
