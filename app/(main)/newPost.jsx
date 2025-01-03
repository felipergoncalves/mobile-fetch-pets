import React, { useState } from 'react';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import { createPost } from '../../services/postService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { updatepost } from '../../services/postService';
const NewPost = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const { post } = useLocalSearchParams();
  const postToEdit = post ? JSON.parse(post) : {};
  //console.log("POST TO EDIT: ", postToEdit);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await createPost(data, data.userId);
      setLoading(false);
      console.log(res);
      if (res.success) {
        //rota de sucesso - ajustar
        router.push("/petRegistrationSuccess");
      } else {
        Alert.alert("Novo Pet", "Erro ao adicionar o pet");
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro ao enviar dados:", error);
      Alert.alert("Novo Pet", "Erro ao processar a solicitação");
    }
  };

  const handleEdit = async (data) => {    
    setLoading(true);
    const req = await updatepost(data, postToEdit.image, data.file);

    if (!req.success) {
      setLoading(false);
      Alert.alert("Erro", req.msg);
      return;
    }
    router.push("/petRegistrationSuccess");
    setLoading(false);
  }

  const handleNext = (data) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, ...data }

      if (step < 3) {
        setStep((prevStep) => prevStep + 1);
      } else {
        // console.log("Terceiro passo: ", updatedForm);

        // Se ele tiver id, é uma edição, se não é uma nova postagem.
        if (postToEdit.id) {
          handleEdit(updatedForm);
          return;
        }
        handleSubmit(updatedForm);
      }
      return updatedForm
    });
  };

  const stepsMapping = {
    [1]: <FirstStep onNext={handleNext} />,
    [2]: <SecondStep onNext={handleNext} />,
    [3]: <ThirdStep onNext={handleNext} isLoading={loading}/>
  }

  return stepsMapping[step]
};

export default NewPost;