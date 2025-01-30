import React from 'react';
import { ClipLoader } from 'react-spinners';

interface LoaderProps {
    loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="loader-overlay">
            <ClipLoader color="#36D7B7" loading={loading} size={50} />
        </div>
    );
};

export default Loader; 