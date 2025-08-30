
"use client"
import Image from 'next/image';
import whatsapp from '../../public/chat.webp';
const Chat = () => {
  const phoneNumber = '+917827488393'; 

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <div className="fixed bottom-0 z-50 right-4">
      <button
        onClick={handleClick}
        className="transform rounded-full"
        aria-label="Chat on WhatsApp"
      >
       <Image src={whatsapp} alt="chat" className='object-cover w-20 h-20' loading="lazy"/>
      </button>
    </div>
  );
};

export default Chat;
