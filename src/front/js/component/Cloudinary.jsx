import React, { useState } from 'react';

const Cloudinary = ({ userId }) => {
    const preset_name = "khypc2aq";
    const cloud_name = "dtgnrbpwn";

    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', preset_name);

        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();
            const imageUrl = file.secure_url;

            setImage(imageUrl);
            setLoading(false);

            // Llamada al backend para guardar la URL
            await saveImageUrl(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }
    };

    // Función para enviar la URL al backend
    const saveImageUrl = async (imageUrl) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "api/imagen", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId, url: imageUrl })
            });

            const data = await response.json();
            console.log('Image URL saved:', data.message);
        } catch (error) {
            console.error('Error saving image URL:', error);
        }
    };

    return (
        <div>
            <h1>Upload Image</h1>
            <input
                type="file"
                name="file"
                placeholder="Upload an image"
                onChange={(e) => uploadImage(e)}
            />
            {loading ? (
                <h3>Loading...</h3>
            ) : (
                <img src={image} className="rounded-circle" alt="imagen subida" />
            )}
        </div>
    );
};
export default Cloudinary;

// AHORA EN CLOUDINARY:


// 17 - Entrá en https://cloudinary.com

// 18 - Registrate con tu gmail y logueate.

// 19 - Una vez en la primer pantalla, tocar el segundo boton de arriba hacia abajo ( contra la izquierda de la pantalla) "Programmable media"

// 20 - Click en "Dashboard". Copia el "Cloud name" de los "Product Environment Credentials"

// 21 - Pegá el nombre recien copiado en el punto 16.2 como valor de la const cloud_name.

// 22 - Volviendo a Cloudinary, hay una ruedita abajo a la izquierda de "settings" Click ahi y depsues en "Upload Presets"

// 23 - Click en "Add upload Preset"

// 24 - Le dejamos el "name" como está. ( este es el name que le pegamos despues a upload_preset en punto 16)

// 25 - En "Signing Mode" seleccionamos "Unsigned"

// 26 - Le damos a "Save", el botón enorme verde a la derecha arriba

// 27 - No te olvides de darle formato a el img para que muestre las imagenes con el tamaño y estilo que vos quieras.

// 28 - Con todo esto ya deberia funcionar.


// EXTRA:

//     Para importar los valores cloud name y upload preset desde el archivo ".env" podes hacerlo así:

//     const cloud_name = import.meta.ev.CLOUD_NAME

//     (recordá definirlo tambien en el archivo ".env" a CLOUD_NAME)
//     Y para la otra variable exactamente lo mismo.



//     <!-- David Ezequiel Cunha Quinteros 26/07/2023 //ultima modif: 15/05/2024 -->