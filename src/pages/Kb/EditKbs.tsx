import { useEffect, useState } from 'react'
import { Tabs, Result, Row, Form, Input, Col, Space, Select, Button } from 'antd'
import PageContainer from '../../components/layout/PageContainer'
import GeneralSettings from '../../components/kbs/GeneralSettings'
import { useHistory, useParams } from 'react-router-dom'
import Parse from 'parse'
import { showNotification } from '../../helpers/notification'
import { useLocation } from 'react-router-dom';
import { SERVER_URL_parsefunctions } from '../../config/parse'
import { toBase64 } from '../../helpers/toBase64'
import { KbClass, kbobj } from '../../types/KbClass'
import Overview from '../Overview'
import { Label } from 'recharts'
const { TabPane } = Tabs

const EditJobs = () => {
  let history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [kbs, setKbs] = useState<KbClass>()

  const [chatbotslist, setChatselectedlist] = useState<any>()
  const [kbname, setKbName] = useState<any>(kbs?.name)
  const [error, setError] = useState<boolean>(false)
  const [pending, setPending] = useState<boolean>(false)
  const location = useLocation()
  var currentUser = Parse.User.current()

  const [optionsSelect, setoptionsSelect] = useState<any>()
  var currentUser = Parse.User.current()
  const [chatbots, setChatbots] = useState<string[]>(currentUser?.attributes.Joblist)
  const setSelectionOptions = async (chatbots) => {
    let KB = chatbots
    if (KB != undefined && KB != null) {
      var count = 1
      var rs
      var actions
      let datainternal: any = [];

      var fn = async function jsonCreator(el) {

        var chatbotOBJ = Parse.Object.extend("chatbots");
        var queryChatbot = new Parse.Query(chatbotOBJ);
        queryChatbot.equalTo("objectId",el)

        var result = await queryChatbot.first()
       

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
        
       


        count = count + 1
        return datainternal
      }
      actions = KB.map(fn);

      rs = await Promise.all(actions)
      setoptionsSelect(rs[0])

    }

  }
  useEffect(() => {
    console.log(chatbots)

    if (chatbots != undefined && chatbots.length > 0) {
      setSelectionOptions(chatbots)

    }
  }, [chatbots])
  useEffect(() => {
    const query = new Parse.Query(kbobj)
    query
      .get(id)
      .then(async (res) => {
        setKbs(res.attributes as KbClass)
        setParseRef(res)
      })
      .catch(() => {
        setError(true)
      })
  }, [id])




  const [parseRef, setParseRef] = useState<Parse.Object>()
  const onSave = async () => {
    var nm = kbs?.name
    if(kbname)  nm = kbname

    parseRef?.save(
      ({ ...kbs, name: nm, chatbots: chatbotslist }))
      showNotification({
        title: 'Erfolgreich gespeichert',
        message: `${nm} wurde erfolgreich gespeichert`,
        type: 'success',
      })
  }

  if (error)
    return (
      <PageContainer pageId='105' title='Fehler beim Laden der Chatbots'>
        <Result
          status={500}
          title='Fehler beim Laden der Chatbots'
          subTitle='Bitte versuche es später erneut'
        />
      </PageContainer>
    )

  if (!kbs)
    return (
      <PageContainer pageId='105' title='Absichten werden geladen...'>
        <h1>Lädt...</h1>
      </PageContainer>
    )

  return (
    <PageContainer
      button
      buttonText=''
      buttonCallback={onSave}
      pageId='105'
      //title={`"${job.title}" bearbeiten`}
      title={kbs?.name ? '"' + kbs?.name + '" bearbeiten' : ""}
      buttonLoading={pending}
    >
      <div style={{border:"outset", padding:"20px", marginBottom:"20px"}}>
        <Row gutter={24}>
          <Col span={8}>
              
              <h3 style={{ marginTop: "10px", fontWeight: "bold" , marginBottom:"10px"}}>Name der Datenbank</h3>
              <Input
                placeholder='Name des Datenbank'
                defaultValue={kbs?.name}
                style={{marginBottom:"40px", width:"500px", height:"55px"}}
                //value={job.title}
                onChange={(e) => {
                  setKbName(e.target.value)

                }
                }

              />

          </Col>

        </Row>
        <Row gutter={24}>
          <Col span={10}>
            <h2>Weisen Sie dieser Datenbank Chatbots zu</h2>
            <Space style={{ marginTop: "5px", width: '100%' }} direction="vertical">

              <Select
                mode="multiple"
                allowClear
                showSearch={false}
                style={{ width: '100%' }}
                placeholder="Bitte wählen Sie eine oder mehrere Datenbanken aus"
                defaultValue={kbs?.chatbots}
                //   defaultValue={}
                onChange={async (e) => {

                  console.log("chatbot list selection")
                  console.log(e)
                  setChatselectedlist(e)

                }}
                options={optionsSelect}
              /></Space>
          </Col>
        </Row>
        <Row gutter={24} style={{marginTop:"20px"}}>
          <Col span={8}>
          <Button type='primary' onClick={onSave}>Name und Datenbankzuweisung speichern</Button>
          </Col>
        </Row>
        </div>
      <Overview kbID={id}></Overview>
      {/* <GeneralSettings
        kb={kbs}
        onKbChange={(updateKb: KbClass) => setKbs(updateKb)}
        parseRef={parseRef}
      /> */}

    </PageContainer>
  )
}

export default EditJobs
