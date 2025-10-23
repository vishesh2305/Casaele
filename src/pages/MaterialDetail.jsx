import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {apiGet} from '../utils/api';

import MaterialHeader from "../components/Material/MaterialDetail/MaterialHeader";
import RelatedMaterials from "../components/Material/MaterialDetail/RelatedMaterial";
import CommentForm from "../components/Material/MaterialDetail/CommentForm";
import CommentList from "../components/Material/MaterialDetail/CommentList";
import DropDown from "../components/Material/MaterialDetail/DropDown";
import reviewsData from "../components/CourseDetail/ReviewsData.jsx";


function MaterialDetail() {
    const location = useLocation();
    const {id} = useParams();

    const [material, setMaterial] = useState(location.state?.material || null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(!material);


        useEffect(() => {
        if (!material) {
            setLoading(true);
            apiGet(`/api/materials/${id}`)
                .then(setMaterial)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
        
        apiGet('/api/materials').then(data => {
            if(Array.isArray(data)) {
                setRelated(data.filter(item => item._id !== id));
            }
        }).catch(console.error);

    }, [id, material]);


    if(loading){
        return <div className="text-center p-20">Loading material...</div>;
    }

    if (!material) {
        return <div className="text-center p-20">Material not found.</div>;
    }


    return (
        <div className="w-full bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section>
                    <MaterialHeader material={material} />
                </section>
                <section className="py-12 sm:py-16"><DropDown exercises={material.embedIds || []} /></section>
                <section className="py-12 sm:py-16">
                    <RelatedMaterials materials={related} onCardClick={setMaterial} />
                </section>
                <section className="py-12 sm:py-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Comentario</h1>
                    <CommentForm />
                    <CommentList />
                </section>
            </div>
        </div>
    );
}

export default MaterialDetail;



