import { Table, Tag, Button, Space, Result, Empty, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import PageContainer from '../../components/layout/PageContainer'
import Parse from 'parse'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Loading } from '../../components/common/Loading'
import { showNotification } from '../../helpers/notification'
import { KbClass, kbobj, generateKb } from '../../types/KbClass'
import { ROUTES } from '../../config/routes'
import { SERVER_URL_parsefunctions } from '../../config/parse'

const Overview = ({ ...data }) => {
  let history = useHistory()

  const [kbs, setKbs] = useState<KbClass[] | null>(null)
  const [error, setError] = useState<boolean>(false)

  var currentUser = Parse.User.current()

  const newFormButtonUI = () => {
    return (
      <Button type="primary" onClick={onNewIntent} style={{
        background: "green", border: 'green', position: 'absolute',
        right: '41px',
        top: '100px',
      }}>
        + Neue Datenbank erstellen
      </Button>
    )
  }


  useEffect(() => {
    if (!currentUser) return
    const getAllIntents = async () => {
      const query = new Parse.Query(kbobj)
      if (currentUser?.attributes.role !== 'admin') {
        query.equalTo('user', currentUser?.id)
      }
      try {
        var results = await query.findAll()
        const parsedResults = results.map((result) => {
          const attributes = result.attributes as KbClass
          return { ...attributes, id: result.id }
        })
        setKbs(parsedResults)
      } catch (error) {
        console.log(error)
        setError(true)
      }
    }
    getAllIntents()
  }, [currentUser])

  // User creates a new job
  const onNewIntent = async () => {
    if (!currentUser) return
    try {
      const generatedId = await generateKb({
        name: '',
        user: currentUser.id,
      })
      history.push(ROUTES.KbState + "/" + generatedId)
    } catch (error) {
      // ToDo
    }
  }

  const onDeleteJob = async (id: string) => {
    if (!currentUser) return
    const query = new Parse.Query(kbobj)
    query.equalTo('user', currentUser.id)
    query.equalTo('objectId', id)
    try {
      const jobToDelete = await query.first()
      var assignedChatbots = jobToDelete?.attributes.chatbots
      if (assignedChatbots) {
        if (assignedChatbots.length > 0) {
          assignedChatbots.forEach(async element => {
            console.log(element)

            const query1 = new Parse.Query(kbobj)
            query1.contains('chatbots', element)
            query1.notEqualTo("objectId", id)
            var resultChatbot = await query1.find()
            if (resultChatbot) {
              if (resultChatbot.length > 0) {
                console.log("resultChatbot exists in other databases")
                console.log(resultChatbot)
              }
              else{
                var chatbotOBJ = Parse.Object.extend("chatbots");
                var queryChatbot = new Parse.Query(chatbotOBJ);
                queryChatbot.equalTo("objectId", element)
  
                var result = await queryChatbot.first()
                if (result) {
                  result.set("activeChatbot", false)
                  result.save()
                }
              }
            }
           

          });
        }
      }
      await jobToDelete?.destroy()
      setKbs(kbs ? kbs.filter((intents) => intents.id !== id) : null)
      console.log(id)
      let formData = { url: "", fileName: "kbidfolder", user: currentUser.id, nameWOS: "kbidfolder", kbId: id }
      const response = fetch(
        SERVER_URL_parsefunctions + "/deletePythonFile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Parse-Application-Id": "what2study",
            "X-Parse-Master-Key": "what2studyMaster",
          },
          body: JSON.stringify(formData),
        }
      );
    } catch (error) {
      showNotification({
        title: 'Fehler beim Löschen',
        message: 'Bitte versuche es später erneut',
        type: 'error',
      })
    }
  }

  const columns = [
    {
      title: 'Name der Datenbank',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <b>{text}</b>,
    },

    {
      title: 'Aktionen',
      key: 'action',
      dataIndex: 'id',
      render: (id: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space>
            <Link to={ROUTES.KbState + "/" + id}>
              <Button type='primary'>Bearbeiten</Button>
            </Link>
            <Popconfirm
              placement='rightTop'
              title='Möchten Sie die Datenbank löschen?'
              okText='Ja, Löschen'
              cancelText='Abbrechen'
              onConfirm={() => onDeleteJob(id)}
            >
              <Button icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ]

  if (error)
    return (
      <PageContainer pageId='105' title='Fehler beim Laden der Datenbank'>
        <Result
          status={500}
          title='Fehler beim Laden der Datenbank'
          subTitle='Bitte versuche es später erneut'
        />
      </PageContainer>
    )

  if (!kbs)
    return (
      <PageContainer
        pageId='105'
        title=' Überblick über die Datenbank'
      >
        <Button type="primary" onClick={onNewIntent} style={{
          background: "green", border: 'green', position: 'absolute',
          right: '100px',
          top: '100px',
        }}>
          + Neue Datenbank erstellen
        </Button>

        <Loading />
      </PageContainer>
    )

  if (kbs.length === 0)
    return (
      <PageContainer
        pageId='5'
        title='Überblick über die Datenbank'
      >
        <Button type="primary" onClick={onNewIntent} style={{
          background: "green", border: 'green', position: 'absolute',
          right: '100px',
          top: '100px',
        }}>
          + Neue Datenbank erstellen
        </Button>


        <Empty description={<span>Keine Datenbank gefunden</span>} />
      </PageContainer>
    )

  return (
    <PageContainer
      pageId='105'
      title='Überblick über die Datenbank'
    >
      <Button type="primary" onClick={onNewIntent} style={{
        background: "green", border: 'green', position: 'absolute',
        right: '41px',
        top: '100px',
      }}>
        + Neue Datenbank erstellen
      </Button>


      <Table style={{ width: "500px", marginLeft: "25%", marginTop: "5%" }} columns={columns} dataSource={kbs} />
    </PageContainer>
  )
}

export default Overview
