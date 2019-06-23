import React, { useState, useCallback, useEffect } from 'react';
import { Form, Header, Container, Divider, Label, Dropdown, Segment, Item, Button, Image, Modal } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import {
    withRouter
} from "react-router-dom";
import { useForm } from "hooks/useForm";
import { useImageCrop } from "hooks/useImageCrop";
import { useDropzone } from 'react-dropzone'

import api from "api.js";

import Skeleton from 'react-loading-skeleton';

import "./CreateGroupForm.scss";

// function CategoryLabel(){

// }

function CreateGroupForm({ groupData, history }) {
    const [categories, setCategories] = useState(new Map());
    const [allCategories, setAllCategories] = useState([]);
    const [cities, setCities] = useState([])
    const [errorText, setErrorText] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState();
    const [friends, setFriends] = useState();

    const crop_data = {
        height: 500,
        width: 800
    };


    const onComplete = async (img) => {
        try {
            const { data } = await api.uploadImage(img);
            setUploadedImageUrl(data.img);
        } catch (error) {
            console.error(error);
        }
    }

    const { values, handleChange, handleSubmit, errors } = useForm(validate, submitGroupForm);
    const { cropModal, setCroppedImageUrl, croppedImageUrl, setModalOpen, setUploadedImage } = useImageCrop(crop_data, onComplete);

    useEffect(() => {
        getAllCities();
        fetchAllCategories();
    }, [])

    useEffect(() => {
        if (groupData) {
            values.name = groupData.group_name;
            values.description = groupData.description;
            values.city = groupData.city_name;
            let names = groupData.categories.map((e) => e.name);
            const colors = ['yellow', 'blue', 'pink', 'red', 'green'];
            names.forEach((name, index) => {
                selectCategory({ content: name, color: colors[index] })
            });
        }
    }, [groupData])


    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles[0].size > 1048576) {
            setErrorText('Image size exceeded');
            return;
        }
        setUploadedImage(URL.createObjectURL(acceptedFiles[0]));
        setModalOpen(true);
    }, [])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: 'image/jpeg, image/png',
    });

    const getAllCities = debounce(async () => {
        try {
            const { data } = await api.getAllCities();
            setCities(data.map((item, index) => {
                const city = {};
                city.key = index;
                city.text = item.name;
                city.value = item.name;
                return city;
            }));
        } catch (error) {
            console.error(error)
        }
    }, 500);

    function displaySelectedCategories() {
        return [...categories].map((category, index) => {
            return <Label content={category[0]} color={category[1]} removeIcon='delete' key={index}
                onRemove={(event, data) => deleteCategory((data))} />;
        });
    }

    function selectCategory(data) {
        let newState = new Map(categories);
        newState.set(data.content, data.color);
        setCategories(newState);
    }

    async function fetchAllCategories() {
        const { data } = await api.getAllCategories();
        setAllCategories(data);
    }


    function displayAllCategories() {
        if (allCategories.length === 0) {
            return <Skeleton width={500} />
        }
        const colors = ['yellow', 'blue', 'pink', 'red', 'green'];
        return allCategories.map((category, index) => {
            return <Label color={colors[index]} content={category.name} key={index}
                onClick={(event, data) => selectCategory(data)} />;
        });
    }

    function deleteCategory(data) {
        let newState = new Map(categories);
        newState.delete(data.content);
        setCategories(newState);
    }

    async function submitGroupForm() {
        try {
            const payload = { ...values, categories: [...categories.keys()], image: uploadedImageUrl }
            if (groupData) {
                const res = await api.updateGroup({...payload, group_id: groupData.group_id});
            }
            else {
                const res = await api.createGroup(payload);
            }
            history.push('/profile');
        } catch (error) {
            console.error(error);
        }
    }

    //Validation Rules
    function validate(values) {
        let errors = {};
        if (!values.name) {
            errors.name = 'Group name is required';
        }
        if (!values.description) {
            errors.description = 'Description is required';
        }
        if (categories.size <= 0) {
            errors.categories = 'Select at least one category';
        }
        if (!values.city) {
            errors.city = 'Location is required';
        }
        return errors;
    };

    return (
        <Container className="create-group-form">
            {groupData ? <Header as='h1'>Manage {groupData.group_name}</Header> : <Header as='h1'>Create a group</Header>}
            <Form size="huge" >
                <Form.Field error={errors.name && errors.name.length !== 0}>
                    <Header as='h3'>Step 1</Header>
                    <Form.Input name="name" value={values.name || ''} label="What will be your group's name?" placeholder='Group name' onChange={handleChange} />
                    {errors.name && (<Label basic color='red' pointing>{errors.name}</Label>)}
                </Form.Field>
                <Divider />
                <Form.Field error={errors.categories && errors.categories.length !== 0}>
                    <Header as='h3'>Step 2</Header>
                    <Header as='h3'>What will your group be about?</Header>
                    <div className="category-box input">
                        {displaySelectedCategories()}
                    </div>
                    {errors.categories && (<Label className='error' basic color='red' pointing>{errors.categories}</Label>)}
                    <Label.Group size='medium'>
                        {displayAllCategories()}
                    </Label.Group>
                </Form.Field>
                <Divider />
                <Form.Field error={errors.city && errors.city.length !== 0}>
                    <Header as='h3'>Step 3</Header>
                    <Header as='h3'>Where will be your group be located?</Header>
                    <Dropdown name='city' search clearable selection value={values.city || ''} onChange={(e, data) => {
                        handleChange(data);
                    }} options={cities}></Dropdown>
                    {errors.city && (<Label basic color='red' pointing>{errors.city}</Label>)}
                </Form.Field>
                <Divider />
                <Form.Field error={errors.description && errors.description.length !== 0}>
                    <Header as='h3'>Step 4</Header>
                    <Form.TextArea name="description" value={values.description || ''} label='Group Description' placeholder='Describe your group briefly' onChange={handleChange} />
                    {errors.description && (<Label basic color='red' pointing>{errors.description}</Label>)}
                </Form.Field>
                <Divider />
                <Header as='h3'>Step 5</Header>
                <Header as='h3'>Upload a group image</Header>
                <Segment placeholder>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {acceptedFiles[0] ?
                            <div align='center'>
                                <p>{errorText}</p>
                                {croppedImageUrl && (
                                    <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                                )}
                                <Button primary>Change Image</Button>
                            </div> : (
                                <div>
                                    <Header textAlign='center' as='h3'>Drag & Drop</Header>
                                    <Divider horizontal>Or</Divider>
                                    <Button primary>Select Image</Button>
                                </div>
                            )}
                    </div>
                    {cropModal()}
                </Segment>
                <Form.Button size="big" color="green" onClick={handleSubmit}>Create Group</Form.Button>
            </Form>
        </Container>
    );
}

export default withRouter(CreateGroupForm);

