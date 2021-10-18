import React from "react";
import {
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  SelectionState,
} from "draft-js";
import "./RichText.css";
class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    // var socket = io.connect("http://localhost:3001", { reconnect: true });
    // var socket = io.connect("http://10.27.153.189:3001", { reconnect: true });
    this.state = {
      editorState: EditorState.createEmpty(),
      parnetAnchorKey: "",
      // typingTimeout: 0,
      socket,
    };
    var socket = this.props.socket;
    socket.on("initialize", (msg) => {
      var input1 = JSON.parse(msg);
      var input2 = convertFromRaw(input1);
      console.log(input2);
      const stateWithContent = EditorState.createWithContent(input2);
      this.setState({ editorState: stateWithContent });
    });
    // this.state = { editorState: EditorState.createEmpty() };
    // console.log(JSON.stringify(this.state.editorState.getCurrentContent()));
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
      console.log("me", editorState.getSelection().getAnchorKey());
      console.log("partner", this.state.parnetAnchorKey);
      // if (
      //   this.state.parnetAnchorKey == editorState.getSelection().getAnchorKey()
      // ) {
      //   console.log("forbidded");
      //   return;
      // }
      console.log(editorState.getSelection().getAnchorKey());
      if (this.state.typingTimeout) {
        clearTimeout(this.state.typingTimeout);
      }
      this.setState(function (prevState, props) {
        return {
          editorState: editorState,
          // typingTimeout: setTimeout(function () {

          // }, 1000),
        };
      });
      var data = convertToRaw(editorState.getCurrentContent());
      var send = JSON.stringify(data);
      socket.emit("newState", {
        state: send,
        anchorKey: editorState.getSelection().getAnchorKey(),
      });
      // var data = convertToRaw(editorState.getCurrentContent());
      // var send = JSON.stringify(data);
      // socket.emit("newState", send);
    };

    socket.on("newState", (msg) => {
      console.log("start");
      this.setState(function (prevState, props) {
        var input1 = JSON.parse(msg["state"]);
        var input2 = convertFromRaw(input1);
        // console.log(input2);
        // const stateWithContent = EditorState.createWithContent(input2);
        // const currentSelection = this.state.editorState.getSelection();
        // // var stateWithContentAndSelection = null;
        // console.log(currentSelection.getAnchorOffset());
        // // var stateWithContentAndSelection = EditorState.push(
        // //   this.state.editorState,
        // //   input2,
        // //   "change-block-data"
        // // );
        // var stateWithContentAndSelection = EditorState.forceSelection(
        //   stateWithContent,
        //   currentSelection
        // );
        // // console.log(stateWithContent.getCurrentContent());
        // // console.log("they", currentSelection.getAnchorOffset());
        // return {
        //   editorState: stateWithContentAndSelection,
        // };
        const oldSelectionState = this.state.editorState.getSelection();
        // console.log(input2);
        const newEditorState = EditorState.createWithContent(input2);
        const newEditorStateWithSelection = EditorState.forceSelection(
          newEditorState,
          oldSelectionState
        );
        console.log("end");
        return {
          editorState: newEditorStateWithSelection,
          parnetAnchorKey: msg["anchorKey"],
        };
      });

      // this.setState({ editorState: stateWithContentAndSelection });
    });

    // this.handleKeyCommand = this._handleKeyCommand.bind(this);
    // this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    // this.toggleBlockType = this._toggleBlockType.bind(this);
    // this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  // _handleKeyCommand(command, editorState) {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     this.onChange(newState);
  //     return true;
  //   }
  //   return false;
  // }

  // _mapKeyToEditorCommand(e) {
  //   if (e.keyCode === 9 /* TAB */) {
  //     const newEditorState = RichUtils.onTab(
  //       e,
  //       this.state.editorState,
  //       4 /* maxDepth */
  //     );
  //     if (newEditorState !== this.state.editorState) {
  //       this.onChange(newEditorState);
  //     }
  //     return;
  //   }
  //   return getDefaultKeyBinding(e);
  // }

  // _toggleBlockType(blockType) {
  //   this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  // }

  // _toggleInlineStyle(inlineStyle) {
  //   this.onChange(
  //     RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
  //   );
  // }

  render() {
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = this.state.editorState.getCurrentContent();
    // if (!contentState.hasText()) {
    //   if (contentState.getBlockMap().first().getType() !== "unstyled") {
    //     className += " RichEditor-hidePlaceholder";
    //   }
    // }

    return (
      <div className="RichEditor-root">
        {/* <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        /> */}
        {/* <InlineStyleControls
          editorState={this.state.editorState}
          onToggle={this.toggleInlineStyle}
        /> */}
        <div className={className} onClick={this.focus}>
          <Editor
            // blockStyleFn={getBlockStyle}
            // customStyleMap={styleMap}
            editorState={this.state.editorState}
            // handleKeyCommand={this.handleKeyCommand}
            // keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.onChange}
            placeholder="Share an idea..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
// const styleMap = {
//   CODE: {
//     backgroundColor: "rgba(0, 0, 0, 0.05)",
//     fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
//     fontSize: 16,
//     padding: 2,
//   },
// };

// function getBlockStyle(block) {
//   switch (block.getType()) {
//     case "blockquote":
//       return "RichEditor-blockquote";
//     default:
//       return null;
//   }
// }

// class StyleButton extends React.Component {
//   constructor() {
//     super();
//     this.onToggle = (e) => {
//       e.preventDefault();
//       this.props.onToggle(this.props.style);
//     };
//   }

//   render() {
//     let className = "RichEditor-styleButton";
//     if (this.props.active) {
//       className += " RichEditor-activeButton";
//     }

//     return (
//       <span className={className} onMouseDown={this.onToggle}>
//         {this.props.label}
//       </span>
//     );
//   }
// }

// const BLOCK_TYPES = [
//   { label: "H1", style: "header-one" },
//   { label: "H2", style: "header-two" },
//   { label: "H3", style: "header-three" },
//   { label: "H4", style: "header-four" },
//   { label: "H5", style: "header-five" },
//   { label: "H6", style: "header-six" },
//   { label: "Blockquote", style: "blockquote" },
//   { label: "UL", style: "unordered-list-item" },
//   { label: "OL", style: "ordered-list-item" },
//   { label: "Code Block", style: "code-block" },
// ];

// const BlockStyleControls = (props) => {
//   const { editorState } = props;
//   const selection = editorState.getSelection();
//   console.log(editorState.getSelection());
//   const blockType = editorState
//     .getCurrentContent()
//     .getBlockForKey(selection.getStartKey())
//     .getType();

//   return (
//     <div className="RichEditor-controls">
//       {BLOCK_TYPES.map((type) => (
//         <StyleButton
//           key={type.label}
//           active={type.style === blockType}
//           label={type.label}
//           onToggle={props.onToggle}
//           style={type.style}
//         />
//       ))}
//     </div>
//   );
// };

// var INLINE_STYLES = [
//   { label: "Bold", style: "BOLD" },
//   { label: "Italic", style: "ITALIC" },
//   { label: "Underline", style: "UNDERLINE" },
//   { label: "Monospace", style: "CODE" },
// ];

// const InlineStyleControls = (props) => {
//   console.log(props.editorState.getCurrentContent().getPlainText("\u0001"));
//   const blockType = props.editorState
//     .getCurrentContent()
//     .getBlockForKey(props.editorState.getSelection().getStartKey())
//     .getType();
// //   const currentStyle = props.editorState.getCurrentInlineStyle();

//   return (
//     <div className="RichEditor-controls">
//       {INLINE_STYLES.map((type) => (
//         <StyleButton
//           key={type.label}
//           active={currentStyle.has(type.style)}
//           label={type.label}
//           onToggle={props.onToggle}
//           style={type.style}
//         />
//       ))}
//     </div>
//   );
// };

export default RichTextEditor;
