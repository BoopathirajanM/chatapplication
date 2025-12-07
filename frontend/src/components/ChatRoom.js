import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { SOCKJS_URL } from '../config';

var stompClient =null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isCurrentUserTyping, setIsCurrentUserTyping] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });
    useEffect(() => {
      console.log(userData);
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS(SOCKJS_URL);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        stompClient.subscribe('/chatroom/typing', onTypingReceived);
        userJoin();
    }

    const userJoin=()=>{
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onTypingReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if(payloadData.senderName !== userData.username) {
            if(payloadData.status === "TYPING") {
                setTypingUsers(prev => new Set([...prev, payloadData.senderName]));
                // Remove user from typing after 3 seconds
                setTimeout(() => {
                    setTypingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(payloadData.senderName);
                        return newSet;
                    });
                }, 3000);
            } else if(payloadData.status === "STOP_TYPING") {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(payloadData.senderName);
                    return newSet;
                });
            }
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
        
        // Send typing indicator
        if (stompClient && value.length > 0) {
            if (!isCurrentUserTyping) {
                setIsCurrentUserTyping(true);
            }
            sendTypingIndicator("TYPING");
            
            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            // Set new timeout to stop typing after 2 seconds of inactivity
            const newTimeout = setTimeout(() => {
                setIsCurrentUserTyping(false);
                sendTypingIndicator("STOP_TYPING");
            }, 2000);
            
            setTypingTimeout(newTimeout);
        } else if (stompClient && value.length === 0) {
            setIsCurrentUserTyping(false);
            sendTypingIndicator("STOP_TYPING");
        }
    }

    const sendTypingIndicator = (status) => {
        if (stompClient) {
            var typingMessage = {
                senderName: userData.username,
                status: status
            };
            stompClient.send("/app/typing", {}, JSON.stringify(typingMessage));
        }
    }
    const sendValue=()=>{
            if (stompClient) {
              // Stop typing when sending message
              setIsCurrentUserTyping(false);
              sendTypingIndicator("STOP_TYPING");
              
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{
        connect();
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (tab === "CHATROOM") {
                sendValue();
            } else {
                sendPrivateValue();
            }
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp || Date.now());
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getOnlineCount = () => {
        return privateChats.size + 1; // +1 for current user
    };

    return (
    <div className="container">
        {userData.connected?
        <div className="chat-box">
            <div className="member-list">
                <div className="member-list-header">
                    <h3>Chat Rooms</h3>
                    <p>{getOnlineCount()} members online</p>
                </div>
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>
                        <div className="avatar">🏠</div>
                        <div>
                            <div>General Chat</div>
                            <small>Public room</small>
                        </div>
                    </li>
                    {[...privateChats.keys()].filter(name => name !== userData.username).map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>
                            <div className="avatar">{name.charAt(0).toUpperCase()}</div>
                            <div>
                                <div>{name}</div>
                                <small>Private chat</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <div className="chat-header">
                    <h3>General Chat</h3>
                    <span className="status">● {getOnlineCount()} members online</span>
                </div>
                {(typingUsers.size > 0 || isCurrentUserTyping) && (
                    <div className="typing-indicator">
                        <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span className="typing-text">
                            {isCurrentUserTyping && typingUsers.size === 0 && `${userData.username} is typing...`}
                            {!isCurrentUserTyping && typingUsers.size > 0 && `${Array.from(typingUsers).join(', ')} ${typingUsers.size === 1 ? 'is' : 'are'} typing...`}
                            {isCurrentUserTyping && typingUsers.size > 0 && `${userData.username}, ${Array.from(typingUsers).join(', ')} are typing...`}
                        </span>
                    </div>
                )}
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName.charAt(0).toUpperCase()}</div>}
                            <div className="message-content">
                                {chat.senderName !== userData.username && <div className="message-sender">{chat.senderName}</div>}
                                <div className="message-data">{chat.message}</div>
                                <div className="message-time">{formatTime(chat.timestamp)}</div>
                            </div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName.charAt(0).toUpperCase()}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <textarea 
                        className="input-message" 
                        placeholder="Type your message..." 
                        value={userData.message} 
                        onChange={handleMessage}
                        onKeyPress={handleKeyPress}
                        rows="1"
                    /> 
                    <button type="button" className="send-button" onClick={sendValue} disabled={!userData.message.trim()}>
                        ➤
                    </button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <div className="chat-header">
                    <div className="avatar">{tab.charAt(0).toUpperCase()}</div>
                    <div>
                        <h3>{tab}</h3>
                        <span className="status">● Online</span>
                    </div>
                </div>
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName.charAt(0).toUpperCase()}</div>}
                            <div className="message-content">
                                {chat.senderName !== userData.username && <div className="message-sender">{chat.senderName}</div>}
                                <div className="message-data">{chat.message}</div>
                                <div className="message-time">{formatTime(chat.timestamp)}</div>
                            </div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName.charAt(0).toUpperCase()}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <textarea 
                        className="input-message" 
                        placeholder={`Message ${tab}...`} 
                        value={userData.message} 
                        onChange={handleMessage}
                        onKeyPress={handleKeyPress}
                        rows="1"
                    /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue} disabled={!userData.message.trim()}>
                        ➤
                    </button>
                </div>
            </div>}
        </div>
        :
        <div className="register">
            <h2>Welcome to ChatApp</h2>
            <p>Enter your name to join the conversation</p>
            <input
                id="user-name"
                placeholder="Enter your username"
                name="userName"
                value={userData.username}
                onChange={handleUsername}
                onKeyPress={(e) => e.key === 'Enter' && registerUser()}
                autoFocus
              />
              <button type="button" onClick={registerUser} disabled={!userData.username.trim()}>
                    Join Chat
              </button> 
        </div>}
    </div>
    )
}

export default ChatRoom
