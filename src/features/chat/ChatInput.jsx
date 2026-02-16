/**
 * 채팅 입력 컴포넌트
 */

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Image as ImageIcon, Smile, Send, Square } from 'lucide-react';
import { useCamera, useAudioRecorder, useImagePicker } from '../../hooks/useMedia.js';
import { useMobileKeyboard } from '../../hooks/useMobileViewport.js';

const commonEmojis = ['😊', '😂', '😍', '🙌', '🔥', '✨', '👍', '😢', '🤔', '😎', '🚀', '❤️', '🎉', '💡', '💯', '🙏'];

export default function ChatInput({ onSendMessage, onSendMedia }) {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const isKeyboardOpen = useMobileKeyboard();
  
  const { isOpen: isCameraOpen, capturedImage, videoRef, canvasRef, startCamera, takePhoto, stopCamera, clearCapturedImage } = useCamera();
  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder();
  const { fileInputRef, openPicker, handleFileSelect } = useImagePicker();

  // 키보드가 올라오면 이모지 피커 닫기
  useEffect(() => {
    if (isKeyboardOpen) {
      setShowEmojiPicker(false);
    }
  }, [isKeyboardOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue, 'text');
    setInputValue('');
    setShowEmojiPicker(false);
  };

  const handleImageSelect = handleFileSelect((dataUrl) => {
    if (onSendMedia) {
      onSendMedia('image', dataUrl);
    }
  });

  const handleAudioStop = () => {
    const audioURL = stopRecording();
    if (audioURL && onSendMedia) {
      onSendMedia('audio', audioURL);
    }
  };

  const handlePhotoCapture = () => {
    takePhoto();
  };

  const handlePhotoSend = () => {
    if (capturedImage && onSendMedia) {
      onSendMedia('image', capturedImage);
      clearCapturedImage();
    }
  };

  const addEmoji = (emoji) => {
    setInputValue(prev => prev + emoji);
  };

  return (
    <>
      {/* Camera Overlay */}
      {isCameraOpen && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          {!capturedImage ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-10 flex items-center justify-between w-full px-12">
                <button onClick={stopCamera} className="text-white">
                  <span className="text-lg">✕</span>
                </button>
                <div onClick={handlePhotoCapture} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-full"></div>
                </div>
                <div className="w-8 h-8"></div>
              </div>
            </>
          ) : (
            <div className="w-full h-full relative">
              <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              <div className="absolute bottom-10 left-0 right-0 px-6 flex justify-between items-center">
                <button onClick={clearCapturedImage} className="bg-black/50 p-3 rounded-full text-white">
                  <span className="text-lg">🗑️</span>
                </button>
                <button onClick={handlePhotoSend} className="bg-blue-500 px-6 py-3 rounded-full text-white font-bold flex items-center gap-2">
                  전송 <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 right-4 bg-white border rounded-2xl shadow-xl p-3 grid grid-cols-8 gap-2 z-20 safe-area-bottom">
          {commonEmojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                addEmoji(emoji);
                setShowEmojiPicker(false);
              }}
              className="text-xl hover:bg-gray-100 p-2 rounded-lg active:scale-125 transition-transform touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <footer className="p-4 border-t border-gray-50 bg-white safe-area-bottom">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:bg-white transition-all">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
          
          {!isRecording && (
            <div
              className="bg-blue-500 p-1.5 rounded-full hover:bg-blue-600 cursor-pointer text-white touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={startCamera}
            >
              <Camera className="w-4 h-4" />
            </div>
          )}

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-2 text-red-500 font-bold animate-pulse">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                녹음 중... {recordingTime}s
              </div>
              <button onClick={handleAudioStop} className="bg-red-500 text-white p-1.5 rounded-full">
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          ) : (
            <input
              ref={inputRef}
              type="text"
              placeholder="메시지 보내기..."
              className="flex-1 bg-transparent border-none outline-none text-[14px] py-1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              onClick={() => setShowEmojiPicker(false)}
              onFocus={() => setShowEmojiPicker(false)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          )}

          {inputValue.trim() && !isRecording ? (
            <button 
              type="button"
              onClick={handleSend} 
              className="text-blue-500 font-bold text-[14px] px-3 py-2 touch-manipulation min-w-[44px] min-h-[44px]"
            >
              보내기
            </button>
          ) : !isRecording && (
            <div className="flex gap-3 text-gray-600 items-center">
              <button
                type="button"
                className="p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-blue-500 active:scale-110 transition-transform"
                onClick={startRecording}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-black transition-colors"
                onClick={openPicker}
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className={`p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${showEmojiPicker ? 'text-blue-500' : ''}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}

