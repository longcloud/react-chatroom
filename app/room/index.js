/**
 * Created by LongCloud on 2016/3/12.
 */
//var ReactDOM = require('react-dom');
//http://lengligeleng.6655.la:31905
var socket =  io('192.168.0.104:3000');
var name='';
socket.on('connect', function(msg){
    console.log('connect from client', msg)
});

socket.on('disconnect', function(msg){
    console.log('disconnect from client', msg);
});

socket.on('name', function(msg){
    name = msg;
});


var ChatBox = React.createClass({
    getInitialState:function(){

        return {
            name: [],
            content:[],
            isMine:[]
        };
    },
    componentDidMount: function(){
        socket.on('chatMessage', (msg) => {
            this.updateMessage(msg.name, msg.content, false);
        });
    },
    updateMessage: function (chatName , msg, isMine) {
        console.log('emit message from client', $('.chat-foot-msg').val());
        this.state.name.push(chatName);
        this.state.content.push(msg);
        this.state.isMine.push(isMine);
        this.setState({
            name:this.state.name,
            content: this.state.content,
            isMine:this.state.isMine
        });
        scrollToBottom();
    },
    sendMessage: function(chatName , msg, isMine){
        this.updateMessage(chatName , msg, isMine);
        socket.emit('chatMessage',{
            name: chatName,
            content: msg
        });
    },
    render: function () {
        return (
            <div className="chat-container">
                <ChatMessageBox name= {this.state.name} content={this.state.content} isMine={this.state.isMine} />
                <ChatSender sendMessage = {() => this.sendMessage(name, $('.chat-foot-msg').val(), true)}/>
            </div>
        )
    }
});
//other-user-msg my-msg
var ChatMessage = React.createClass({
    render: function () {
        return (
            <li className={this.props.msgFrom} >
                <div className="user-id">
                    {this.props.name}
                </div>
                <div className="message-content">
                    {this.props.message}
                </div>
                <div className="meesage-placeholder">
                </div>
            </li>
        );
    }
});

var ChatMessageBox = React.createClass({
    rows : function (name, content, isMine) {
        var lstMsg = [];
        for(var i = 0; i < isMine.length; i++){
            var cssName;
            if(isMine[i]){
                cssName = 'my-msg user-msg ';
            } else {
                cssName= 'other-user-msg user-msg';
            }
            lstMsg.push(<ChatMessage msgFrom = {cssName} key={i} name={name[i]} message={content[i]}/>);
        }
        return lstMsg;
    },
    render: function () {
        return (
            <ul className="chat-message-box">
                {this.rows(this.props.name, this.props.content, this.props.isMine)}
            </ul>
        );
    }
});

var ChatSender = React.createClass({
    render: function () {
        return (
            <div className="chat-foot">
                <input type="text" className="chat-foot-msg"/>
                <input type="button" value="发送" className="chat-foot-btn" onClick={() => this.props.sendMessage()}/>
            </div>
        );
    }
});

React.render(
    <ChatBox/>,
    document.getElementById('example')
);


function scrollToBottom(){
    setTimeout(function(){
        $('.chat-message-box').scrollTop($('.chat-message-box')[0].scrollHeight);
    },100);
}