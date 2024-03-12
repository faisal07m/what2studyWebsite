
import { Link, useHistory } from 'react-router-dom'
import { Tag, InputRef, theme, Input, Space, TableProps, Table, Button, Modal, TableColumnType, Image } from 'antd'

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { deleteKnowledgeItem, getAllKnowledgeBaseWithType, knowledgeBaseBlock } from '../types/knowledgeBase';
import { showNotification } from '../helpers/notification';

import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { FilterDropdownProps } from 'antd/es/table/interface';
import ReactPlayer from 'react-player'
import Highlighter from 'react-highlight-words';
type loc = {
    id: string
}
const FilesListTable: React.FC<loc> = (props: loc) => {

    type DataIndex = keyof DataType;
    interface DataType {
        key: string;
        name: string;
        hochgeladen: string;
        priority: string;
        expiry: string
        tags: string[];
        itemId: string,
        fileName: string,
        user: string,
        url: string

    }


    const [urlViewer, setUrlViewer] = useState<string>("https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js")
    const [modal1Open, setModal1Open] = useState(false);
    const [data, setData] = useState<DataType[]>()

    const [dataNew, setDataNew] = useState<DataType[]>()

    const [tableElement, setTableElement] = useState<JSX.Element>()

    const [id, setId] = useState<string>(props.id)

    const [fileText, setFileText] = useState<string>("")

    const [mediaUrl, setMediaUrl] = useState<string>("")


    const [fileTextJSX, setFileTextJSX] = useState<JSX.Element>(<></>)
    const [knowledgeBase, setKnowledgeBase] = useState<knowledgeBaseBlock[] | any>()

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    {/* <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            onClick={()=> handleSearch([""], confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button> */}
                    {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            setSearchText('');
                            handleSearch([""], confirm, dataIndex)
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const updateData = async (record) => {
        await deleteKnowledgeItem(record.itemId)
        var index = data?.findIndex(obj => obj.itemId === record.itemId);
        if (index !== -1 && index != undefined) {
            if (data) {
                const objArr = data[index]

                let formData = { url: objArr.url, fileName: objArr.fileName, user: objArr.user }
                console.log(formData)

                const response = fetch(
                    "http://localhost:1339/what2study/parse/functions/deletePythonFile",
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
            }
            data?.splice(index, 1);
            setDataNew(data)
        }

        showNotification({
            title: 'Erfolgreich gelöschte Datei',
            message: 'Erfolg',
            type: 'success',
        })



    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Name der Datei',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (_, record) => <a href={record.url} download={record.fileName}>{record.fileName}</a>,
        },
        {
            title: 'Hochgeladen am',
            dataIndex: 'hochgeladen',
            key: 'hochgeladen',
        },
        {
            title: 'Priorität',
            dataIndex: 'priority',
            key: 'priority',
        },
        {
            title: 'Ablaufdatum',
            dataIndex: 'expiry',
            key: 'expiry',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Aktionen',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => {

                        if (id == "2") {
                            textView(record.url)
                        }
                        if (id == "1") {
                            setUrlViewer(record.url)
                        }
                        if (id == "3") {
                            setMediaUrl(record.url)
                        }
                        if (id == "4") {
                            textView(record.url)
                        }
                        setModal1Open(true)

                    }}>Anzeigen</Button>
                    <Button danger icon={<DeleteOutlined />}
                        onClick={(e) => {
                            updateData(record)
                        }}

                    >Löschen</Button>
                </Space>
            ),
        },
    ];



    const setTableData = async (id) => {
        let type = ""
        if (id == "1") {
            type = "pdf"
        }
        else if (id == "2") {
            type = "text"
        }
        else if (id == "3") {
            type = "media"
        }
        else if (id == "4") {
            type = "url"
        }

        if (type != "") {

            let KB = await getAllKnowledgeBaseWithType(type);
            let data: DataType[] = [];
            console.log(KB)
            if (KB != undefined && KB != null && Array.isArray(KB)) {
                var count = 1
                KB.forEach(element => {
                    data.push(
                        {
                            key: count.toString(),
                            name: element.attributes.name,
                            hochgeladen: element.createdAt.getDate() + "/" + element.createdAt.getMonth() + "/" + element.createdAt.getFullYear(),
                            priority: element.attributes.priority,
                            expiry: element.attributes.expires,
                            tags: element.attributes.tags,
                            itemId: element.id,
                            url: element.attributes.fileUrl,
                            fileName: element.attributes.name,
                            user: element.attributes.user,
                        },
                    )
                    count = count + 1


                });
                setData(data)
            }
        }
    }

    useEffect(() => {
        setTableData(id)
    }, [id]);


    useEffect(() => {
    }, [data]);

    useEffect(() => {
        setData(dataNew)
        setTableData(id)
    }, [dataNew]);


    const textView = (raw) => {
        fetch(raw)
            .then(r => r.text())
            .then(text => {
                console.log('text decoded:', text);
                setFileText(text)
                setFileTextJSX(<> <p style={{ minHeight: "800px" }}> {text}</p></>)
            });
    }
    return (
        <>
            {/* {tableElement} */}
            <Table rowKey="Name" columns={columns} dataSource={data} />
            <Modal
                title="Dateibetrachter"
                style={{ top: 20 }}
                width={1200}
                open={modal1Open}
                onOk={() => setModal1Open(false)}
                onCancel={() => setModal1Open(false)}
            >
                <div style={{
                    width: "95%", height: "90%", backgroundColor: "#e4e4e4", overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "center"

                }}>

                    {fileText.length > 0 ? fileTextJSX : id == "1" ? <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer fileUrl={urlViewer} />
                    </Worker> : <></>}
                    {mediaUrl != "" && (mediaUrl.endsWith("jpg") || mediaUrl.endsWith("png") || mediaUrl.endsWith("jpeg")) ? <>
                        <Image
                            width="80%"
                            height="60%"
                            src={mediaUrl}
                        />


                    </> : <ReactPlayer
                        className='react-player fixed-bottom'
                        url={mediaUrl}
                        width='60%'
                        controls={true}

                    />}


                </div>
            </Modal>
        </>
    )

}

export default FilesListTable