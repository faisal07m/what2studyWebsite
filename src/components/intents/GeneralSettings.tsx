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
import { JobOfferBlock } from '../../types/JobOffers'
import "../../styles.css"
import 'react-phone-number-input/style.css'
import { IntentClass } from '../../types/IntentClass'
import { useEffect, useState } from 'react'
import { showNotification } from '../../helpers/notification'
import TextArea from 'antd/es/input/TextArea'
import { useLocation, useParams } from 'react-router-dom'
import { getAllKbs } from '../../types/KbClass'
import Parse from 'parse'


type GeneralSettingsProps = {
  intent: IntentClass,
  onIntentChange: (updateIntent: IntentClass) => void,
  parseRef: any
}

const GeneralSettings = ({ intent, onIntentChange, parseRef }: GeneralSettingsProps) => {

  const { id } = useParams<{ id: string }>()
 
  const [changedState, setChangedState] = useState<boolean>(false)
  const [changecount, setchangecount] = useState<number>(0)
  const location = useLocation()
  const [anzeigname, setAnzeigname] = useState<string>()

  const [clearVal, setClearVal] = useState("")
  const [linkTreeUrl, setlinkTreeUrl] = useState<string>()

  const [nameIntent, setNameIntent] = useState<string>(intent.name)
  const errorCss = { borderColor: "red", width: "500px", height: "55px" }
  const errorCssInvert = { borderColor: "rgb(217 217 217)", width: "500px", height: "55px" }
  const [name, setName] = useState<string>(intent.name)
  const handleAnzeigename = (e: { target: { name: any; value: any } }, index: number) => {
    setAnzeigname(e.target.value)
  };
  // handle input change for link tree url
  const handleLinkTreeURL = (e: { target: { name: any; value: any } }, index: number) => {
    var val: string = e.target.value

    setlinkTreeUrl(val)
    setClearVal("")
  };
  useEffect(() => {
    if (changedState == true) {

      location.state = { changedstate: changedState, unSavedObj: intent, parseRef: parseRef }
    }
  }, [changedState])

  useEffect(() => {
    if (changecount > 3) {
      setChangedState(true)

      //location.state = { changedstate: changedState, unSavedObj: job, parseRef: parseRef }
    }
    setchangecount(changecount + 1)
  }, [intent])
  const [errorsValChanged, setErrorCounter] = useState<number>(0)
  //const errorsVal = errorsValProp
  const [errorsVal, setErrorsVal] = useState<{
    name: boolean,

  }>({
    name: false,

  })
  useEffect(() => {
    onIntentChange({ ...intent, name: nameIntent })
  }, [nameIntent])
  const requiredField = <p style={{ color: "red", fontSize: "large", marginBottom: "" }}>* <span style={{ fontSize: "small", color: "#ae9c9c" }}>Dieser Wert ist erforderlich</span></p>

  //handle click event of the hashtag add button
  const handleInputAdd = () => {
    setClearVal("")
         
    if (anzeigname && linkTreeUrl) {
      if (intent.scenario == undefined) {
        onIntentChange({ ...intent, scenario: [{ 'anfrag': anzeigname, 'antwort': linkTreeUrl }] })
      }
      else {
        if (intent.scenario.filter(e => e.anfrag === anzeigname || e.antwort === linkTreeUrl).length > 0) {
          showNotification({
            type: 'error',
            title: 'Doppelte Einträge gefunden',
            message: ''
          })
          return false
        }
        intent.scenario.push({ 'anfrag': anzeigname, 'antwort': linkTreeUrl })
        //job.hashtags.push({'hashtag':hashtag})
        onIntentChange({ ...intent, scenario: intent.scenario })
      }


    }


  }

  // handle hashtag edit func
  const handleInputChangeEditAnzeiganame = (e: { target: { name: any; value: any } }, index: number) => {
    if (e.target.value != "") {
      intent.scenario[index].anfrag = e.target.value
      onIntentChange({ ...intent, scenario: intent.scenario })
    }
    else {
      showNotification({
        type: 'error',
        title: 'Einträge können nicht bearbeitet werden',
        message: 'Bitte versuchen Sie es erneut'
      })
    }
  };

  const handleInputChangeEditURL = (e: { target: { name: any; value: any } }, index: number) => {
    var val: string = e.target.value


    if (e.target.value != "") {
      intent.scenario[index].antwort = val
      onIntentChange({ ...intent, scenario: intent.scenario })
    }
    else {
      showNotification({
        type: 'error',
        title: 'Einträge können nicht bearbeitet werden',
        message: 'Bitte versuchen Sie es erneut'
      })
    }
  };

  //handle click event of the hashtag Remove button
  const handleRemoveClick = (index: number) => {
    if (intent.scenario) {
      let arr = intent.scenario
      arr.splice(index, 1)
      onIntentChange({ ...intent, scenario: arr })
    }
  };


  const [chatbotslist, setChatselectedlist] = useState<any>()
  const [optionsSelect, setoptionsSelect] = useState<any>()
  var currentUser = Parse.User.current()
  const [chatbots, setChatbots] = useState<string[]>()
  const setSelectionOptions = async (chatbots) => {
    let KB = chatbots
    if (KB != undefined && KB != null) {
      var count = 1
      var rs
      var actions
      let datainternal: any = [];

      var fn = async function jsonCreator(el) {

        var kbclass = Parse.Object.extend("kbclass");
        var queryChatbot = new Parse.Query(kbclass);

        var intents = Parse.Object.extend("intents");
        var kbquery = new Parse.Query(intents);
        kbquery.contains("kbs",el)
        kbquery.notEqualTo("objectId", id)
        var chatbotFound = await kbquery.find()
        if(chatbotFound.length==0 )

        {var result = await queryChatbot.get(el)

        if (result) {
          var name = result.attributes.name
          if (result.attributes.name == "") {
            name = el
          }
          datainternal.push(
            {
              label: name,
              value: el

            },
          )
          }
        }
       


        count = count + 1
        return datainternal
      }
      actions = KB.map(fn);

      rs = await Promise.all(actions)
      setoptionsSelect(rs[0])

    }

  }
var activeKBSet=()=>{

  getAllKbs().then((KB)=>{
   
    if (KB != undefined && KB != null && Array.isArray(KB)) {
      var list =[] as any
      KB.forEach(element => {
     
list.push(element.id)
        
      });
      setSelectionOptions(list)
  }
  
  
  })
}


  useEffect(() => {
    console.log(chatbots)
    activeKBSet()
   
  }, [chatbots])
  return (
    <div style={{ backgroundColor: "white", height: "2000px", paddingBlock: "10px", padding: "50px" }}>

      
       <div style={{border:"double", padding:"20px", marginBottom:"20px"}}>
        <Row gutter={24}>
          <Col span={8} style={{ marginLeft: "1px", marginTop: "15px" }}>    
     
          <h3>Name des Speziallfalls:</h3> <Tooltip title={"Falls ein Spezialfall eintritt (z. B. Streik des ÖPNVs) können Sie hier eine vorgefertigte Antwort festlegen, die der Chatbot ausgibt."} >
                              <InfoCircleOutlined style={{marginLeft:"8px",color:"#1477ff"}}/>
                          </Tooltip>

          
        <Input
          // style={{width:"320px", marginBlock:"10px", marginLeft:"10px", height:"45px"}}

          style={errorsVal.name ? errorCss : errorCssInvert}
          placeholder='Füge den Namen des Spezialfalls hinzu'

          defaultValue={intent.name}
          //value={job.title}
          onChange={(e) => {
            setNameIntent(e.target.value)
            var errorVal = errorsVal
            errorVal.name = false
            setErrorsVal(errorVal)
          }}

        />

      
{requiredField}
      <br></br>
      </Col>

        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <h3>Ordnen Sie den Spezialfall einer Datenbank zu</h3>
            <Space style={{ marginTop: "5px", width: '100%' }} direction="vertical">

              <Select
                // mode=""
                allowClear
                showSearch={false}
                style={{ width: '100%' }}
                placeholder="Bitte wählen Sie Chatbot/s aus"
                defaultValue={intent?.kbs}
                //   defaultValue={}
                onChange={async (e) => {

                  setChatselectedlist(e)
                  onIntentChange({ ...intent, kbs: e })

                }}
                options={optionsSelect}
              /></Space>
          </Col>
        </Row>
        {/* <Row gutter={24} style={{marginTop:"20px"}}>
          <Col span={8}>
          <Button type='primary' onClick={onSave}>Namen und Chatbot-Auswahl speichern</Button>
          </Col>
        </Row> */}
        </div>
     <br></br>
     <br></br>
      <h3>Frage-Antwort-Paare hinzufügen. Klicken Sie auf "Hinzufügen", um das Frage-Antwort-Paar zu erstellen</h3>

      <Row gutter={26} style={{ marginBottom: '10px', marginLeft: "1px", marginTop: "20px" }}><h4 style={{ marginTop: '5px' }}> </h4>
        <Form.Item label='Frage' name='Frage' >
          <TextArea
            style={{ width: '500px' }}
            autoSize={{ minRows: 3, maxRows: 5 }}
            placeholder='Füge eine Benutzeranfrage hinzu'
            defaultValue={clearVal}
            disabled={false}
            id='frage1'
            onChange={e => {
              handleAnzeigename(e, 0)
            }}
          /></Form.Item>
        <Form.Item style={{ marginLeft: "20px" }} label='Antwort' name='Antwort' >
          <TextArea
            style={{ width: '500px' }}
            autoSize={{ minRows: 3, maxRows: 5 }}
            placeholder='Füge eine Antwort hinzu'
            defaultValue={clearVal}
            id='frage2'
            disabled={false}
            onBlur={e => {
              handleLinkTreeURL(e, 0)
            }}

          />
        </Form.Item>

        

      
      </Row>
      <Col style={{  marginTop: "3px" }}>
          {/* <button onClick={() => handleInputAdd()}>Hinzufügen<PlusCircleFilled disabled={false} style={{ fontSize: '18px', color: '#08c', marginLeft: "2px", marginTop: "2px" }}  ></PlusCircleFilled> </button> */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() =>{ 
            handleInputAdd()
          }
            }>
            Hinzufügen </Button>
        </Col>
      <br></br>
      <br></br>
      <div style={{border:"outset"}}>
      {intent.scenario && intent.scenario.map((x, i) => {
        return (
          <Row style={{ marginBottom: '10px', marginLeft: "1px", marginTop: "20px" }}><h4 style={{ marginRight: '5px', marginTop: '8px' }}> <CaretRightFilled />  {i +1}. </h4>
            <Form.Item label=' Frage-Antwort-Paar  '   >
              <TextArea
                style={{ width: '500px' }}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder='Füge eine Benutzeranfrage hinzu'
                defaultValue={x.anfrag}
                disabled={false}
                onBlur={e => {
                  handleInputChangeEditAnzeiganame(e, 0)
                }}
              /></Form.Item>
            <Form.Item style={{ marginLeft: "20px" }} label='' name='Antwort'  >
              <TextArea
                style={{ width: '500px' }}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder='Füge eine Antwort hinzu'
                defaultValue={x.antwort}
                disabled={false}
                onBlur={e => {
                  handleInputChangeEditURL(e, 0)
                }}
              /></Form.Item>
            <Col style={{ marginLeft: "2px", marginTop: "1px" }}>
              {/* <MinusCircleFilled style={{ marginLeft: '5px', fontSize: '25px', color: '#08c' }} onClick={() => handleRemoveClick(i)} className="mr10" /> */}
              <Button danger style={{ marginLeft: '8px' }} icon={<MinusCircleFilled />} onClick={() => handleRemoveClick(i)}>
                Löschen </Button>
            </Col>
          </Row>
        );
      })}
      {intent.scenario.length == 0 && <h2 style={{padding:"30px"}}>Bisher kein Frage-Antwort-Paar hinzugefügt</h2>}
</div>


    </div>

  )
}

export default GeneralSettings

