import PageContainer from '../components/layout/PageContainer'
import Parse from 'parse'
import { useHistory } from 'react-router-dom'
import { Row, Col, Tabs, Upload, Button, UploadProps, Form, Select, DatePicker, Input, Checkbox, Spin, Modal } from 'antd'

import { ApiTwoTone, CodeOutlined, HddTwoTone, InboxOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { knowledgeBaseBlock, generateKnowledge, getKnowledgeBase } from '../types/knowledgeBase'
import type { ConfigProviderProps, RadioChangeEvent } from 'antd';
import ChatClient from "what2study-chatclient";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Bar,
  PieChart, Pie, Sector, Cell
} from 'recharts'
import { useEffect, useRef, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons'
import { showNotification } from '../helpers/notification'
import { toBase64 } from '../helpers/toBase64'
import { getCurrentUser } from '../types/user'
import dayjs from 'dayjs'
import TagComponent from './TagComponent';
import FilesListTable from './FilesListTable';
import TextArea from 'antd/es/input/TextArea';
import { getActiveChatbotID, getScriptTag } from '../types/JobOffers';
import { SERVER_URL, SERVER_URL_parsefunctions, ServerCrawl } from '../config/parse';

const Overview = () => {

  const { Option } = Select
  const history = useHistory()
  history.push('/what2study/database')
  type SizeType = ConfigProviderProps['componentSize'];
  const [size, setSize] = useState<SizeType>('large');
  const [size2, setSize2] = useState<SizeType>('large');
  const curUser = Parse.User.current()
  const [curUserId, setCurUserId] = useState<string>();
  const [activeChatbotID, setActiveChatID] = useState<any>("")
  const disable = { pointerEvent: "none",opacity: 0.7 }
  const [mainDiv, setMainDiv] = useState<boolean>(true)
  const enable = {  pointerEvent: "unset",opacity: 1}
  
    // Enable subscription to chart name change
    var embeddingStatus = Parse.Object.extend("embeddingStatus");
    var q2 = new Parse.Query(embeddingStatus);
    q2.subscribe().then(async function (sub) {
        sub.on('update', function (message) {
         
           if(message.attributes.user ==curUser?.id )
           {
            if(message.attributes.status == 0){
              setMainDiv(true)
              console.log("subscription")
            }
            else{
              setMainDiv(false)
            }
          }
        });   
    });

     // Enable subscription to chart name change
     var knowledgeBase = Parse.Object.extend("knowledgeBase");
     var q3 = new Parse.Query(knowledgeBase);
     q3.subscribe().then(async function (sub) {
         sub.on('update', function (message) {
          
            if(message.attributes.user ==curUser?.id )
            {
             if(message.attributes.jobStatus == true){
              //  setMainDiv(true)
              setLoader(false)
              setTableJSX(<></>)
              setTableJSX(JSXelementTable(localStorage.getItem("tableID")))
             
               console.log("subscription success")
             }
             else{
              //  setMainDiv(false)
              setLoader(false)
      
             }
           }
         });   
     });

  var activeIDset=async ()=>{
    let res = await getActiveChatbotID()
    setActiveChatID(res)
  }
  useEffect(() => {
   activeIDset()
   setCurUserId(curUser?.id)
   var embeddingStatus = Parse.Object.extend("embeddingStatus");
   var q2 = new Parse.Query(embeddingStatus);
   q2.equalTo("user", curUser?.id)
   q2.first().then((e)=>{if(e && e.attributes.status==1){ setMainDiv(false)}})
  }, [])
  var currentUser = Parse.User.current()
  const [knowledgebases, setknowledgeBases] = useState<knowledgeBaseBlock[] | null>(null)

  const [base64, setBase64] = useState<any>()

  const [priority, setPriority] = useState<string>("")


  const [indexFileContent, setIndex] = useState<string>("")

  const [transcript, setTranscript] = useState<string>("")

  const [urlViewer, setUrlViewer] = useState<string>("https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js")
  const [loader, setLoader] = useState<any>(false)
  const [nPLus1, setNPLus1] = useState<boolean>(false)

  const [urlCrawler, setUrlCrawler] = useState<string>("")
  const [tagsArray, setTagsArray] = useState<string[]>([])

  const [nestedLinks, setNestedLinks] = useState<string[]>([])

  const [fileName, setFileName] = useState<string>("")

  const [url, setUrl] = useState<string>("")

  const [defaultActiveKey, setDefKey] = useState<string>("1")

  const [token, setToken] = useState<any>()
  const [scriptTag, setScriptTag] = useState<any>()
  const [expires, setExpiry] = useState<string>(dayjs().year() + "/" + "02")
  const setScriptTagAsync = async () => {
    getScriptTag().then(function (val) {
      var token = /token=.*'/g.exec(val)
      if (token) {
        setToken(token[0].slice(6, -1))
      }
      return val
    })
  }
  useEffect(() => {
    setScriptTagAsync()
  }, [])

  const JSXelementTable = (id) => {
    return <Tabs
      defaultActiveKey={localStorage.getItem("tableID")||id}
      // activeKey={localStorage.getItem("tableID")||id}
      type="card"
      size={size2}
      items={new Array(4).fill(null).map((_, i) => {
        const id = String(i + 1);
        return {
          label: <>{id == "1" ? <>Dateien</> : id == "2" ? <>Text</> : id == "3" ? <>Medien</> : id == "4" ? <>URL Crawl Jobs</> : <></>}</>,
          key: id,
          children: <> <FilesListTable id={id}></FilesListTable></>,
        };
      })}
    />
  }

  const [tableJSX, setTableJSX] = useState<JSX.Element>(JSXelementTable(defaultActiveKey))
  useEffect(()=>{
  localStorage.setItem("tableID", defaultActiveKey)
  setTableJSX(JSXelementTable(localStorage.getItem("tableID")))
  
  },[defaultActiveKey])

  const monthFormat = 'YYYY/MM';

  const props: UploadProps = {
    accept: "application/pdf",
    customRequest: async (componentsData) => {
      return true
    },

    async beforeUpload(file) {

      setFileName(file.name)
      const base64 = await toBase64(file).catch((err) =>
        showNotification({
          type: 'error',
          title: 'Fehler beim Hochladen',
          message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
        })
      )
      setBase64(base64)
      return true
    },
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
      }
      file.status = "done"
    },
    defaultFileList: [
      // {
      //   uid: '1',
      //   name: 'xxx.png',
      //   status: 'uploading',
      //   url: 'http://www.baidu.com/xxx.png',
      //   percent: 33,
      // },
    ],
  };

  const propsText: UploadProps = {
    accept: "text/plain",
    customRequest: async (componentsData) => {
      return true
    },

    async beforeUpload(file) {

      setFileName(file.name)
      const base64 = await toBase64(file).catch((err) =>
        showNotification({
          type: 'error',
          title: 'Fehler beim Hochladen',
          message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
        })
      )
      setBase64(base64)
      return true
    },
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
      }
      file.status = "done"
    },
    defaultFileList: [
      // {
      //   uid: '1',
      //   name: 'xxx.png',
      //   status: 'uploading',
      //   url: 'http://www.baidu.com/xxx.png',
      //   percent: 33,
      // },
    ],
  };

  const propsMedia: UploadProps = {
    accept: "image/png, image/jpeg, image/jpg,video/mp4",
    customRequest: async (componentsData) => {
      return true
    },

    async beforeUpload(file) {

      setFileName(file.name)
      const base64 = await toBase64(file).catch((err) =>
        showNotification({
          type: 'error',
          title: 'Fehler beim Hochladen',
          message: 'Beim Hochladen des Bildes ist ein Fehler aufgetreten.',
        })
      )
      setBase64(base64)
      return true
    },
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
      }
      file.status = "done"
    },
    defaultFileList: [
      // {
      //   uid: '1',
      //   name: 'xxx.png',
      //   status: 'uploading',
      //   url: 'http://www.baidu.com/xxx.png',
      //   percent: 33,
      // },
    ],
  };

  const submitKnowledgeBase = async (fileType) => {
    let fileObjName = ""
    let className = ""
    let propertyName = ""
    if (fileType == "pdf") {
      fileObjName = "pdfUpload"
      className = "PDF"
      propertyName = "pdf"
      setDefKey("1")
    }
    else if (fileType == "text") {
      fileObjName = "textUpload"
      className = "TEXT"
      propertyName = "text"
      setDefKey("2")
    }
    else if (fileType == "media") {
      fileObjName = "mediaUpload"
      className = "Media"
      propertyName = "media"
      setDefKey("3")
    }
    else {
      fileObjName = "url"
      className = "URL"
      propertyName = "url"
      setDefKey("4")
    }
    if (base64 != undefined) {
      const parseFile = new Parse.File(fileObjName, { base64: base64 as string });
      parseFile.save().then(async (responseFile) => {
        const Gallery = Parse.Object.extend(className);
        const gallery = new Gallery();
        gallery.set(propertyName, responseFile);

        let response = await gallery.save();
        var url = response.attributes[propertyName]._url
        if (Parse.serverURL.includes("cpstech")) {
          url = url.replace("http:", "https:")

        }
        else if (Parse.serverURL.includes("localhost")) {
          url = url.replace("https:", "http:")
        }
        setUrl(url)
        setUrlViewer(url)
        setFileName(fileName)
        generateKnowledge({
          name: fileName,
          user: currentUser?.id,
          type: fileType,
          priority: priority,
          expires: expires,
          tags: tagsArray,
          transcript: transcript,
          fileUrl: url,
          jobStatus:false ,
          nestedLinks:nestedLinks,
          nPlus1: nPLus1,

        }).then(data => {
          setTableJSX(<></>)
          setTableJSX(JSXelementTable(localStorage.getItem("tableID")))
          setLoader(false)
          showNotification({
            title: 'Datei erfolgreich hochgeladen',
            message: 'Erfolg',
            type: 'success',
          })
          let formData = { url: url, fileName: fileName, user: currentUser?.id, indexFile: "", type:fileType, transcript:transcript }


          const response = fetch(
            SERVER_URL_parsefunctions+"/uploadPythonFile",
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


          return true

        })
          .catch(error => {
            console.log('Error fetching profile ' + error)
            setLoader(false)
          })
      }).catch((e) => {
        setLoader(false)
        showNotification({
          type: 'error',
          title: 'Bitte überprüfen Sie den Dateinamen. Entfernen Sie Zahlen wie (1)* am Ende des Dateinamens, falls vorhanden.',
          message: '',
        })
      })
    }
    else {
      setLoader(false)
      showNotification({
        type: 'error',
        title: 'Bitte überprüfen Sie den Dateinamen. Entfernen Sie Zahlen wie (1)* am Ende des Dateinamens, falls vorhanden.',
        message: '',
      })
    }

  }


  const saveCrawlData = async (url) => {
    var fileObjName = "url"
    var className = "URL"
    var propertyName = "url"

      if(urlCrawler.startsWith("https"))
     { var tempFileNameArr = urlCrawler.split("https://")
      var tempFileName}
      else if(urlCrawler.startsWith("http"))
     { var tempFileNameArr = urlCrawler.split("https://")
      var tempFileName}
      else{
        var tempFileNameArr = urlCrawler.split("/")
        var tempFileName
      }

      if(tempFileNameArr){
        tempFileName=tempFileNameArr[1].replaceAll("/","_")
      }
      setDefKey("4")
      // setFileName(response.attributes[propertyName]._name)
      var res = await generateKnowledge({
        // name: response.attributes[propertyName]._name,
        name: tempFileName,
        user: currentUser?.id,
        type: "url",
        priority: priority,
        expires: expires,
        tags: tagsArray,
        transcript: transcript,
        fileUrl: url,
        nestedLinks:[],
        nPlus1: nPLus1,
        jobStatus:false ,
      })
      setTableJSX(<></>)
      setTableJSX(JSXelementTable(localStorage.getItem("tableID")))
      setLoader(false)
      showNotification({
        title: 'Datei erfolgreich hochgeladen',
        message: 'Erfolg',
        type: 'success',
      })
      let formData = { url: urlCrawler, allowDeepCrawl:nPLus1?"1":"0", userId: curUser?.id, jobId:res }
      

      const response = fetch(
        ServerCrawl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      ).then(response => response.json())
        .then(data => {
         
        })
        .catch(error => console.error(error));;

  }

    const [open, setOpen] = useState(false);

    const showModal = () => {
      setOpen(true);
    };
    const handleOk = () => {
      let formData = {  user: currentUser?.id }
          setMainDiv(false)
          showNotification({
            title: 'Training initiiert',
            message: 'Der Chatbot wird auf Basis der Wissensdatenbank trainiert',
            type: 'info',
          })

          const response = fetch(
            SERVER_URL_parsefunctions+"/startEmbeddings",
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
      setOpen(false);
    };

    const handleCancel = () => {
      setOpen(false);
    };

  return (
    <PageContainer pageId='1'
      title='Wissensdatenbank'>
        <div style={mainDiv == false ? disable:enable}>
        <Row style={{justifyContent:"right"}}>
       {mainDiv == true && <Button  
           onClick={(e)=>{
            showModal()
          
        }} style={{ boxShadow : "0 0 15px #ff0000ab",height:"70px", lineHeight:"30px"}} icon={<ApiTwoTone style={{ fontSize: '250%', color:"#257dfe"}}/>}>Training des Chatbots starten</Button>}
                      
        </Row>
       {mainDiv ?   <div>
      <fieldset style={{ width: "100%" }}>
        <legend>Neues Wissen hinzufügen</legend>
        <Tabs
          defaultActiveKey="1"
          type="card"
          size={size}

          items={new Array(4).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: <>{id == "1" ? <>Dateien</> : id == "2" ? <>Text</> : id == "3" ? <>Mediendateien</> : <>URL</>}</>,
              key: id,
              children: <>
                {id == "1" ?

                  <div style={{ background: "white", height: "380px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                    <Row>
                      <Col span={14} style={{ marginTop: "20px" }}>
                        <Upload {...props} maxCount={1} listType='picture'>

                          <Button  style={{width:"450px", height:"150px", backgroundColor:"#fafafa", border:"dashed 0.3px"}} icon={<InboxOutlined style={{ fontSize: '350%', color:"#257dfe"}}/>}><br></br><span>Hochladen: Nur PDF-Dateien</span></Button>
                        </Upload>
                      </Col>
                      <Col span={3} >

                        <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                          <Select
                            style={{ width: "100px" }}
                            placeholder="Select"
                            defaultValue={priority}
                            onChange={(value) => {
                              setPriority(value)
                            }}
                          >

                            <Option value='Hoch'>Hoch</Option>
                            <Option value='Mittel'>Mittel</Option>

                            <Option value='Niedrig'>Niedrig</Option>

                          </Select>

                        </Form.Item>
                      </Col>
                      <Col span={4} >

                        <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                          <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                            console.log(s)
                            setExpiry(s)
                          }} />

                        </Form.Item>

                      </Col>
                      <Col span={2} >
                        <Form.Item name='' style={{ marginTop: "10px" }}>

                          <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                            setLoader(true)
                            submitKnowledgeBase("pdf")
                            
                          }}>
                            Hinzufügen
                          </Button>
                        </Form.Item>

                      </Col>
                    </Row>
                    <Row style={{ marginTop: "70px" }}>
                      <TagComponent saveCallback={(tagsArr) => {
                        setTagsArray(tagsArr)
                      }} />
                    </Row>
                    {loader == true && <Row style={{ justifyContent: "center" }}>

                      <div className="loader">
                        <Spin size="large" /><span> Upload in Bearbeitung</span>
                      </div>

                    </Row>}
                  </div>
                  : id == "2" ?




                    <div style={{ background: "white", height: "380px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                      <Row>
                        <Col span={14} style={{ marginTop: "20px" }}>
                          <Upload {...propsText} maxCount={1} listType='text'>
                          <Button  style={{width:"450px", height:"150px", backgroundColor:"#fafafa", border:"dashed 0.3px"}} icon={<InboxOutlined style={{ fontSize: '350%', color:"#257dfe"}}/>}><br></br><span>Hochladen: Nur Textdateien</span></Button>
                        
                          </Upload>
                        </Col>
                        <Col span={3} >

                          <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                            <Select
                              style={{ width: "100px" }}
                              placeholder="Select"
                              defaultValue={priority}
                              onChange={(value) => {
                                setPriority(value)
                              }}
                            >

                              <Option value='Hoch'>Hoch</Option>
                              <Option value='Mittel'>Mittel</Option>

                              <Option value='Niedrig'>Niedrig</Option>

                            </Select>

                          </Form.Item>
                        </Col>
                        <Col span={4} >

                          <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                            <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                              setExpiry(s)
                            }} />

                          </Form.Item>

                        </Col>
                        <Col span={2} >
                          <Form.Item name='' style={{ marginTop: "10px" }}>

                            <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                              setLoader(true)

                              submitKnowledgeBase("text")
                            }}>
                              Hinzufügen
                            </Button>
                          </Form.Item>

                        </Col>
                      </Row>
                      <Row style={{ marginTop: "70px" }}>
                        <TagComponent saveCallback={(tagsArr) => {
                          setTagsArray(tagsArr)
                        }} />
                      </Row>
                      {loader == true && <Row style={{ justifyContent: "center" }}>

                        <div className="loader">
                          <Spin size="large" /><span> Upload in Bearbeitung</span>
                        </div>

                      </Row>}
                    </div> : id == "3" ?


                      <div style={{ background: "white", height: "550px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                        <Row>
                          <Col span={14} style={{ marginTop: "20px" }}>
                            <Upload {...propsMedia} maxCount={1} listType='text'>
                            <Button  style={{width:"450px", height:"150px", backgroundColor:"#fafafa", border:"dashed 0.3px"}} icon={<InboxOutlined style={{ fontSize: '350%', color:"#257dfe"}}/>}><br></br><span>Hochladen: Nur Bilder und Videos (jpg, png, mp4)</span></Button>
                        
                            </Upload>
                          </Col>
                          <Col span={3} >

                            <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                              <Select
                                style={{ width: "100px" }}
                                placeholder="Select"
                                defaultValue={priority}
                                onChange={(value) => {
                                  setPriority(value)
                                }}
                              >

                                <Option value='Hoch'>Hoch</Option>
                                <Option value='Mittel'>Mittel</Option>

                                <Option value='Niedrig'>Niedrig</Option>

                              </Select>

                            </Form.Item>
                          </Col>
                          <Col span={4} >

                            <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                              <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                                setExpiry(s)
                              }} />

                            </Form.Item>

                          </Col>
                          <Col span={2} >
                            <Form.Item name='' style={{ marginTop: "10px" }}>

                              <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                                setLoader(true)

                                submitKnowledgeBase("media")
                              }}>
                                Hinzufügen
                              </Button>
                            </Form.Item>

                          </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Form.Item name='Abschrift' label="Transkription/Beschreibung der Mediendatei" style={{ marginTop: "10px" }}>

                            <TextArea
                              onChange={(e) => setTranscript(e.target.value)}
                              placeholder=""
                              autoSize={{ minRows: 7, maxRows: 8 }}
                              style={{ width: "650px" }}
                            />
                          </Form.Item>

                        </Row>
                        <Row style={{ marginTop: "70px" }}>
                          <TagComponent saveCallback={(tagsArr) => {
                            setTagsArray(tagsArr)
                          }} />
                        </Row>
                        {loader == true && <Row style={{ justifyContent: "center" }}>

                          <div className="loader">
                            <Spin size="large" /><span> Upload in Bearbeitung</span>
                          </div>

                        </Row>}
                      </div> : <div style={{ background: "white", height: "450px", marginTop: "-13px", marginLeft: "2px", padding: "10px" }}>
                        <Row>
                          <Col span={14} style={{ marginTop: "20px" }}>

                          </Col>
                          <Col span={3} >

                            <Form.Item label='Priorität' name='chatbotLanguage' style={{ marginTop: "10px" }}>
                              <Select
                                style={{ width: "100px" }}
                                placeholder="Select"
                                defaultValue={priority}
                                onChange={(value) => {
                                  setPriority(value)
                                }}
                              >

                                <Option value='Hoch'>Hoch</Option>
                                <Option value='Mittel'>Mittel</Option>

                                <Option value='Niedrig'>Niedrig</Option>

                              </Select>

                            </Form.Item>
                          </Col>
                          <Col span={4} >

                            <Form.Item label='Gültigkeit bis' name='chatbotLanguage' style={{ marginTop: "10px" }}>

                              <DatePicker defaultValue={dayjs(expires, monthFormat)} format={monthFormat} picker="month" onChange={(e, s) => {
                                setExpiry(s)
                              }} />

                            </Form.Item>

                          </Col>
                          <Col span={2} >
                            <Form.Item name='' style={{ marginTop: "10px" }}>

                              <Button type="primary" icon={<SendOutlined />} onClick={(e) => {
                                saveCrawlData(url)
                                }}>
                                Hinzufügen
                              </Button>
                            </Form.Item>

                          </Col>
                        </Row>
                        <Row>

                          <Col span={14} >


                            <Form.Item label='URL einer Webseite eingeben' name='crawlerUrl'
                            >
                              <Input
                                addonBefore="https://"
                                placeholder='university.de'
                                onChange={(e) => {
                                  var val: string = e.target.value

                                  if (e.target.value != "") {
                                    if (!val.includes("https://")) {
                                      val = "https://" + val
                                    }
                                  }
                                  setUrlCrawler(val)

                                }
                                }
                              />

                            </Form.Item>

                          </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Form.Item name='Abschrift' label="Web-Crawler Konfiguration" style={{ marginTop: "10px" }}>

                            <Checkbox defaultChecked={nPLus1} onChange={(e)=>{
                            console.log(e.target.checked)
                            setNPLus1(e.target.checked)
                            
                            }}>Hierarchische Abfrage (n+1)</Checkbox>
                          </Form.Item>

                        </Row>
                        <Row style={{ marginTop: "70px" }}>
                          <TagComponent saveCallback={(tagsArr) => {
                            setTagsArray(tagsArr)
                          }} />
                        </Row>
                        {loader == true && <Row style={{ justifyContent: "center" }}>

                          <div className="loader">
                            <Spin size="large" /><span> Upload in Bearbeitung</span>
                          </div>

                        </Row>}
                      </div>
                }
              </>,
            };
          })}
        />


      </fieldset>


      <fieldset style={{ width: "100%", marginTop: "100px" }}>
        <legend> Aktuelle Wissensdatenbank</legend>
        <>{tableJSX}</>


      </fieldset>

      {activeChatbotID && 
     <>
      <div style={{
        position: "fixed",
        bottom: 0,
        right: 0
    }}>
    <div className='speech-bubble'>Klick mich</div>
    </div>
      <ChatClient
        objectId={activeChatbotID}
        userId={curUserId}
        universityId={curUserId}
        accessToken={token}
        chatbotId={activeChatbotID}
      ></ChatClient></>}
      </div>:
      <div>
      <Row style={{justifyContent:"center"}}><video width="300" height="250" autoPlay loop >
      <source src="https://cpstech.de/chatanimation" type="video/mp4"/>
     </video></Row>
     <Row>

      <h3 style={{marginBlock:"40px", width:"600px", marginLeft:"30%"}}>Das Training des Chatbots kann je nach Größe und Anzahl der Dateien stark variieren (von einigen Sekunden bis zu einer Stunde). <br></br><br></br>

Da das Training serverseitig abläuft, können Sie den Tab schließen, zu einem anderen Tab wechseln oder sich von der Plattform abmelden. Das Training wird dadurch nicht unterbrochen.<br></br><br></br>

Beachten Sie, dass Sie und die Benutzer auch während eines laufenden Trainingsprozesses mit dem Chatbot interagieren können (basierend auf der vorherigen Wissensdatenbank).</h3><br></br>
     </Row>
     </div>
     }
      </div>
      <Modal
        open={open}
        title="Traningsprozess starten "
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Starten"
        cancelText="Abbrechen"
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <h3 style={{marginBlock:"40px", marginLeft:"50px", marginRight:"50PX"}}>Bevor Sie den Trainingsprozess starten, vergewissern Sie sich, dass Sie alle relevanten Dateien und URLs unter "Aktuelle Wissensdatenbank" über den Button "Hinzufügen" aufgenommen haben. <br></br><br></br>

        Der Trainingsprozess kann nicht gestoppt werden und kann mehrere Minuten dauern.</h3>
      </Modal>
    </PageContainer >
  )
}

export default Overview
function createBrowserHistory(arg0: { basename: string }): History {
  throw new Error('Function not implemented.')
}

