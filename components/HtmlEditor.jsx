import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

function HTMLEditor(props) {
	return (
		<div className="html-editor">
			<Editor defaultLanguage='html' defaultValue="<!-- Enter something -->" height="750px" theme="vs-dark" onChange={props.handleChange}></Editor>
		</div >
	)
}

export default HTMLEditor;
