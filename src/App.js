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
        id={topic.id} // a태그에 id값 부여
        href={'/read/' + topic.id}
        onClick={event => { // {SyntheticBaseEvent} attributes 중 {DOMEventTarget}target 제공
          event.preventDefault(); // 클릭해도 reload되지 않음
          onChangeMode(event.target.id); // event.target = 이벤트 유발시킨 태그 = a 태그
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

function App() {
  const topics = [
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
  ];

  return (
    <div>
      <Header title="React" onChangeMode={() => {
        alert('Header');
      }}></Header>
      <Nav topics={topics} onChangeMode={(id) => {
        alert(id);
      }}></Nav>
      <Article title="Welcome" body="Hello, WEB"></Article>
    </div>
  );
}

export default App;
