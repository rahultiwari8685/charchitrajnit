import React, { useState } from "react";
import { CCard, CCardHeader, CCardBody, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilList } from "@coreui/icons";

import PlanList from "./PlanList";
import PlanForm from "./PlanForm";

const Plans = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPlan, setEditPlan] = useState(null);

    const toggleForm = () => {
        setShowForm(!showForm);
        setEditPlan(null);
    };

    return (
        <CCard className="shadow border-0 rounded-4">
            <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">

                    <h5 className="m-0">Plan Master</h5>

                    <CButton color="light" variant='outline' className="fw-semibold px-3 shadow-sm rounded-pill" onClick={toggleForm}>
                        <CIcon icon={showForm ? cilList : cilPlus} className="me-2" />
                        {showForm ? "View Plans" : "Add Plan"}
                    </CButton>
                </div>
            </CCardHeader>

            <CCardBody>
                {showForm ? (
                    <PlanForm
                        editPlan={editPlan}
                        onSuccess={() => setShowForm(false)}
                    />
                ) : (
                    <PlanList
                        onEdit={(plan) => {
                            setEditPlan(plan);
                            setShowForm(true);
                        }}
                    />
                )}
            </CCardBody>
        </CCard>
    );
};

export default Plans;
