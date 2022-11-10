import { useState } from 'react'; // react 내장 훅

/**
 * @param {String}   title
 * @param {function} onChangeMode
 * @returns header 태그
 */
function Header(props) {
  return <header>
    <h1>
      <a href='/' onClick={(event) => {
        /*
         * onClick 함수 속성으로 설정
         * -> 순수 HTML a태그 아닌 유사 HTML가 됨
         * => react 개발환경이 HTML로 convert하여 브라우저에서 인식됨
         */
        event.preventDefault(); // 클릭해도 reload되지 않음
        props.onChangeMode();
      }}>
        { props.title }
      </a>
    </h1>
  </header>
}

/**
 * @param {Array}     topics 
 * @param {function}  onChangeMode(id)
 * @returns nav 태그
 */
function Nav(props) {
  const { topics, onChangeMode } = props;
  const list = [];
  for (let i = 0; i < topics.length; i++) {
    let topic = topics[i];
    list.push(<li key={topic.id}>
      <a
        id={topic.id} // a태그에 id값 부여 => 태그의 속성으로 넘기면 자동형변환(->String)됨
        href={'/read/' + topic.id}
        onClick={event => { // {SyntheticBaseEvent} attributes 중 {DOMEventTarget}target 제공
          event.preventDefault(); // 클릭해도 a태그의 기본 동작인 reload 및 request URL 변경 불가 처리
          onChangeMode(Number(event.target.id)); // event.target = 이벤트 유발시킨 태그 = a 태그 // 형변환 처리(String->Number)
        }}
      >
        { topic.title }
      </a>
    </li>);  // 태그 그대로 배열에 push
  }

  return <nav>
    <ol>
      { list }
    </ol>
</nav>
}

/**
 * @param {String} title
 * @param {String} body
 * @returns article 태그
 */
function Article(props) {
  return <article>
    <h2>{ props.title }</h2>
    { props.body }
  </article>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault(); // 기본 동작인 reload 불가 처리
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body); // form에 입력된 항목 전달
    }}>
      <p><input type="text" name="title" placeholder='title'></input></p>
      <p><textarea name="body" placeholder='body'></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props) {
  const [ title, setTitle ] = useState(props.topic.title);
  const [ body, setBody ] = useState(props.topic.body);

  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault(); // 기본 동작인 reload 불가 처리
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body); // form에 입력된 항목 전달
    }}>
      <p>
        {/*
          * [onChange함수]
          * HTML: blur
          * React: change
          */}
        <input type="text" name="title" value={title} placeholder='title' onChange={event => {
          setTitle(event.target.value);
        }}></input>
      </p>
      <p>
        <textarea name="body" value={body} placeholder='body' onChange={event => {
          setBody(event.target.value);
        }}></textarea>
      </p>
      <p>
        <input type="submit" value="Update"></input>
      </p>
    </form>
  </article>
}

function App() {
  /**
   * useState
   * @param           state 초기값
   * @returns {Array} #0: 상태값 / #1: 상태값 변경 함수
   */
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  const [ mode, setMode ] = useState('WELCOME');
  const [ id, setId ] = useState(null);
  const [ nextId, setNextId ] = useState(4);
  const [ topics, setTopics] = useState([
    {
      id: 1,
      title: 'html',
      body: 'html is ...',
    },
    {
      id: 2,
      title: 'css',
      body: 'css is ...',
    },
    {
      id: 3,
      title: 'js',
      body: 'js is ...',
    },
  ]);

  let content = null;
  let contextCtrl = null;
  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if (mode === 'READ') {
    const topic = topics.find((topic) => topic.id === id);
    content = <Article title={topic.title} body={topic.body}></Article>

    contextCtrl = <>
      <li>
        <a href={`/update/${topic.id}`} onClick={event => {
          event.preventDefault();
          setMode('UPDATE');
        }}>Update</a>
      </li>
      <li>
        <input type="button" value="Delete" onClick={() => {
          // (버튼 태그 기본 동작 없음)
          const newTopics = [...topics];
          const index = newTopics.findIndex((topic) => topic.id === id);
          newTopics.splice(index, 1);
          setTopics(newTopics);
          setId(newTopics[0].id); // topics 미반영
          setMode('WELCOME');
        }}></input>
      </li>
    </>
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(title, body) => {
      // Object 타입 state 설정 방법 - state 변경ONLY 
      // 1. 설정 대상 복제
      const newTopics = [...topics];
      // 2. 복제본에 변경 반영
      newTopics.push({
        id: nextId,
        title,
        body,
      });
      // 3. 복제본을 설정
      setTopics(newTopics);

      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  } else if (mode === 'UPDATE') {
    const topic = topics.find((topic) => topic.id === id);
    content = <Update topic={topic} onUpdate={(title, body) => {
      const newTopics = [...topics];
      const index = newTopics.findIndex((topic) => topic.id === id);
      newTopics.splice(index, 1, {
        id,
        title,
        body,
      });
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    <div>
      <Header title="React" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode('READ');
        setId(_id)
      }}></Nav>
      { content }
      <ul>
        <li>
          <a href="/create" onClick={event => {
            event.preventDefault(); // 클릭해도 a태그의 기본 동작인 reload 및 request URL 변경 불가 처리
            setMode('CREATE');
          }}>Create</a>
        </li>
        { contextCtrl }
      </ul>
    </div>
  );
}

export default App;
