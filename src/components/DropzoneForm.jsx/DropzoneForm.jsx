import { useDropzone } from "react-dropzone";


const DropzoneForm = () => {
    const {getInputProps, getRootProps} = useDropzone({
        multiple: true,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg']
        }
    })
    return (
        <div className="dropzone__container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag n drop some files here, ssor click to select files</p>
                <em>Avaiable formats: jpg, png, bpm..</em>
          </div>
        </div>
    )
}

export default DropzoneForm;