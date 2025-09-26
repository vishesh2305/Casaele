import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import cardData from '../components/Material/MaterialDetail/material';
import CommentsData from "../components/Material/MaterialDetail/commentsData";

import MaterialHeader from "../components/Material/MaterialDetail/MaterialHeader";
import RelatedMaterials from "../components/Material/MaterialDetail/RelatedMaterial";
import CommentForm from "../components/Material/MaterialDetail/CommentForm";
import CommentList from "../components/Material/MaterialDetail/CommentList";
import DropDown from "../components/Material/MaterialDetail/DropDown";

function MaterialDetail() {
    const location = useLocation();
    const initialMaterial = location.state || cardData[0]; // Fallback for direct navigation

    const [current, setCurrent] = useState(initialMaterial);

    return (
        <div className="w-full bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <section>
                    <MaterialHeader material={current} />
                </section>

                <section className="py-12 sm:py-16">
                    <DropDown />
                </section>

                <section className="py-12 sm:py-16">
                    <RelatedMaterials materials={cardData} onCardClick={setCurrent} />
                </section>

                <section className="py-12 sm:py-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">
                        Comentario
                    </h1>
                    <CommentForm />
                    <CommentList comments={CommentsData} />
                </section>
                
            </div>
        </div>
    );
}

export default MaterialDetail;