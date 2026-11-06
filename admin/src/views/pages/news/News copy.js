import React, { useState } from "react";
import {
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CRow,
    CCol,
} from "@coreui/react";

const News = () => {
    const [videoType, setVideoType] = useState("youtube"); // default
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        videoType: "youtube",
        youtubeUrl: "",
        videoFile: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="d-flex flex-column flex-lg-row gap-4">
            {/* Left Panel: Form */}
            <CCol lg={7}>
                <CCard className="shadow-sm border-0 rounded-3">
                    <CCardBody>
                        <h5 className="mb-4 fw-bold text-dark">Upload Video News</h5>

                        <CForm onSubmit={handleSubmit}>
                            {/* Basic Info */}
                            <h6 className="mb-3 text-secondary">Basic Information</h6>
                            <CRow className="mb-4">
                                <CCol md={6}>
                                    <CFormInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter video title"
                                        required
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        type="text"
                                        name="slug"
                                        label="Slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="Auto or custom slug"
                                        required
                                    />
                                </CCol>
                            </CRow>

                            {/* Categorization */}
                            <h6 className="mb-3 text-secondary">Categorization</h6>
                            <CRow className="mb-4">
                                <CCol md={6}>
                                    <CFormSelect
                                        name="category"
                                        label="Category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="politics">Politics</option>
                                        <option value="sports">Sports</option>
                                        <option value="entertainment">Entertainment</option>
                                        <option value="technology">Technology</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol md={6}>
                                    <CFormSelect
                                        name="videoType"
                                        label="Video Source"
                                        value={formData.videoType}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setVideoType(e.target.value);
                                        }}
                                        required
                                    >
                                        <option value="youtube">YouTube</option>
                                        <option value="self">Upload File</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>

                            {/* Video Input */}
                            <h6 className="mb-3 text-secondary">Video Input</h6>
                            {videoType === "youtube" && (
                                <CFormInput
                                    type="url"
                                    name="youtubeUrl"
                                    label="YouTube URL"
                                    value={formData.youtubeUrl}
                                    onChange={handleChange}
                                    placeholder="https://youtube.com/..."
                                    required
                                    className="mb-4"
                                />
                            )}

                            {videoType === "self" && (
                                <CFormInput
                                    type="file"
                                    name="videoFile"
                                    label="Upload Video File"
                                    accept="video/*"
                                    onChange={handleChange}
                                    required
                                    className="mb-4"
                                />
                            )}

                            <div className="d-flex justify-content-end">
                                <CButton type="submit" color="primary" className="px-4">
                                    Publish
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>

            {/* Right Panel: Live Preview */}
            <CCol lg={5}>
                <CCard className="shadow-sm border-0 rounded-3 bg-light">
                    <CCardBody>
                        <h6 className="mb-3 fw-bold">Live Preview</h6>

                        {/* Title & Category */}
                        {formData.title && (
                            <p className="fw-semibold mb-1">Title: {formData.title}</p>
                        )}
                        {formData.category && (
                            <p className="text-muted mb-3">
                                Category: {formData.category.toUpperCase()}
                            </p>
                        )}

                        {/* Video Preview */}
                        {videoType === "youtube" && formData.youtubeUrl && (
                            <iframe
                                width="100%"
                                height="250"
                                className="rounded"
                                src={`https://www.youtube.com/embed/${formData.youtubeUrl.split("v=")[1]
                                    }`}
                                title="YouTube Preview"
                                allowFullScreen
                            ></iframe>
                        )}

                        {videoType === "self" && formData.videoFile && (
                            <video
                                width="100%"
                                height="auto"
                                className="rounded"
                                controls
                            >
                                <source src={URL.createObjectURL(formData.videoFile)} />
                            </video>
                        )}

                        {!formData.youtubeUrl && !formData.videoFile && (
                            <div className="text-center text-muted py-5">
                                <p>No video selected yet</p>
                            </div>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </div>
    );
};

export default News;
