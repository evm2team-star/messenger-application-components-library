import TitleBar from '../../components/TitleBar';
import './styles.css';

function PageNotFoundContent() {
  return (
    <div className="notFoundContainer">
      <h1 className="errorCode">404</h1>
      <div className="errorTextContainer">
        <h2 className="errorTitle">Oops! Page Not Found</h2>
        <p className="errorMessage">
          The page you're looking for doesn't exist or has moved.
        </p>
      </div>
    </div>
  );
}

function PageNotFound () {
  return (
    <>
      <TitleBar controls={
        { 
          minimize: false, 
          maximize: false, 
          close: true 
        }
       } />
      <PageNotFoundContent />
    </>
  );
}

export default PageNotFound;