import React, { useState } from "react";
import {
    CCard,
    CCardHeader,
    CCardBody,
    CButton
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilList } from "@coreui/icons";

import SubscriptionList from "./SubscriptionList";
import SubscriptionForm from "./SubscriptionForm";

const Subscriptions = () => {
    const [showForm, setShowForm] = useState(false);
    const [editSub, setEditSub] = useState(null);

    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="m-0">Subscriptions</h5>

                <CButton
                    color="primary"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditSub(null);
                    }}
                >
                    <CIcon icon={showForm ? cilList : cilPlus} className="me-2" />
                    {showForm ? "View Subscriptions" : "Assign Subscription"}
                </CButton>
            </CCardHeader>

            <CCardBody>
                {showForm ? (
                    <SubscriptionForm
                        editSub={editSub}
                        onSuccess={() => setShowForm(false)}
                    />
                ) : (
                    <SubscriptionList
                        onEdit={(sub) => {
                            setEditSub(sub);
                            setShowForm(true);
                        }}
                    />
                )}
            </CCardBody>
        </CCard>
    );
};

export default Subscriptions;
