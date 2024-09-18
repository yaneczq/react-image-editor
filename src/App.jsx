import { useState } from 'react';
import Form from './components/Form/Form';

const App = () => {
    const [setUploadedFiles] = useState([]);

    const handleFilesAccepted = (files) => {
        // Debugging: log the files when accepted
        console.log('Files accepted in DropzoneForm:', files);

        setUploadedFiles(files);
    };

    return (
            <Form onFilesAccepted={handleFilesAccepted} />
    );
};

export default App;


    {/* Presets Dropdown */}
                    {/* <select onChange={(e) => loadPreset(e.target.value)} defaultValue="">
                            <option value="" disabled>Select a preset</option>
                            {savedPresets.map((preset, index) => (
                                <option key={preset.id} value={index}>
                                    Preset {index + 1}
                                    <button onClick={() => deletePreset(preset.id)}>Delete</button>

                                </option>
                            ))}
                    </select> */}

                    {/* {savedPresets.length > 0 && (
                            <div className="preset-list">
                                {savedPresets.map((preset) => (
                                    <div key={preset.id} className="preset-item">
                                        <span>Preset {preset.id}</span>
                                        <button onClick={() => deletePreset(preset.id)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                    )} */}