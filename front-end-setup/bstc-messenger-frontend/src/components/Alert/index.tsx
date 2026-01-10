import { WarningIcon } from '../../assets/icons';
import TitleBar from '../TitleBar';
import './styles.css';

interface AlertMessageProps {
  message: string;
}

function AlertMessage({ message }: AlertMessageProps) {
  return (
    <div className="alertMessageContainer">
      <div className="alertMessage">{message}</div>
    </div>
  );
}

const AlertSVGIcons: Record<string, JSX.Element> = {
  warning: (
    <WarningIcon style={{ width: '4rem', height: '4rem' }}/>
  )
}

interface AlertProps {
  type: 'info' | 'warning' | 'error';
}

function Alert({type}: AlertProps) {
  const urlParams = new URLSearchParams(window.location.search);

  return (
    <>
      <TitleBar controls={
        { 
          minimize: false, 
          maximize: false, 
          close: true 
        }
       } />
      <div className="alertContainer">
        {AlertSVGIcons[type]}
        <AlertMessage message={urlParams.get('message') || 'No message provided'} />
      </div>
    </>
  );
}

export default Alert;