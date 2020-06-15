import React,{Component} from 'react'
import ReactMarkdown from 'react-markdown'

class ReactMarkdownExample extends Component {
  render ()
  {
    const input ='## HELLO'
    return <ReactMarkdown source={input}/>
  }
}
export default ReactMarkdownExample