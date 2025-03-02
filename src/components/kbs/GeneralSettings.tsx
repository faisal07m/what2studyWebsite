import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Image,
  Tag,
  Space,
  Button,
  Skeleton,
  Checkbox,
  Slider,
  ColorPicker,
  Tooltip
} from 'antd'
import {
  GlobalOutlined,
  DeleteTwoTone,
  SoundTwoTone,
  DownOutlined,
  PlusCircleFilled,
  MinusCircleFilled,
  SendOutlined,
  PlusOutlined,
  CaretRightFilled,
  InfoCircleOutlined
} from '@ant-design/icons'
import "../../styles.css"
import 'react-phone-number-input/style.css'
import { KbClass } from '../../types/KbClass'
import { useEffect, useState } from 'react'
import { showNotification } from '../../helpers/notification'
import TextArea from 'antd/es/input/TextArea'
import { useLocation } from 'react-router-dom'



type GeneralSettingsProps = {
  kb: KbClass,
  onKbChange: (updateKb: KbClass) => void,
  parseRef: any
}

const GeneralSettings = ({ kb, onKbChange, parseRef }: GeneralSettingsProps) => {


  const [changedState, setChangedState] = useState<boolean>(false)
  const [changecount, setchangecount] = useState<number>(0)
  const location = useLocation()
  const [anzeigname, setAnzeigname] = useState<string>()
  const [linkTreeUrl, setlinkTreeUrl] = useState<string>()

  const [nameIntent, setNameIntent] = useState<string>(kb.name)
  const errorCss = { borderColor: "red", width: "500px", height: "55px" }
  const errorCssInvert = { borderColor: "rgb(217 217 217)", width: "500px", height: "55px" }
  const [name, setName] = useState<string>(kb.name)
  const handleAnzeigename = (e: { target: { name: any; value: any } }, index: number) => {
    setAnzeigname(e.target.value)
  };
  // handle input change for link tree url
  const handleLinkTreeURL = (e: { target: { name: any; value: any } }, index: number) => {
    var val: string = e.target.value

    setlinkTreeUrl(val)
  };
  useEffect(() => {
    if (changedState == true) {

      location.state = { changedstate: changedState, unSavedObj: kb, parseRef: parseRef }
    }
  }, [changedState])

  useEffect(() => {
    if (changecount > 3) {
      setChangedState(true)

      //location.state = { changedstate: changedState, unSavedObj: job, parseRef: parseRef }
    }
    setchangecount(changecount + 1)
  }, [kb])
  const [errorsValChanged, setErrorCounter] = useState<number>(0)
  //const errorsVal = errorsValProp
  const [errorsVal, setErrorsVal] = useState<{
    name: boolean,

  }>({
    name: false,

  })
  useEffect(() => {
    onKbChange({ ...kb, name: nameIntent })
  }, [nameIntent])
  

 

 
  return (
    <div style={{ backgroundColor: "white", height: "2000px", paddingBlock: "10px", padding: "50px" }}>

         </div>

  )
}

export default GeneralSettings

