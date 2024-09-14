import { useState } from 'react';
import DropzoneForm from './components/DropzoneForm/DropzoneForm';

const App = () => {
    const [setUploadedFiles] = useState([]);

    const handleFilesAccepted = (files) => {
        // Debugging: log the files when accepted
        console.log('Files accepted in DropzoneForm:', files);

        setUploadedFiles(files);
    };

    return (
        <div className='app'>
            <DropzoneForm onFilesAccepted={handleFilesAccepted} />
        </div>
    );
};

export default App;
