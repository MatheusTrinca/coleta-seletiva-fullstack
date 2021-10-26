import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

const CreateLocation: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedMapPosition, setSelectedMapPosition] = useState<
    [number, number]
  >([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    city: '',
    uf: '',
  });

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const getItems = async () => {
      const response = await api.get('items');
      setItems(response.data);
    };
    getItems();
  }, []);

  function handleMapClick(event: LeafletMouseEvent): void {
    setSelectedMapPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData(oldData => {
      return {
        ...oldData,
        [event.target.name]: event.target.value,
      };
    });
  }

  function handleSelectedItem(id: number) {
    const found = selectedItems.includes(id);
    if (found) {
      return setSelectedItems(oldItems => {
        return oldItems.filter(item => item !== id);
      });
    }
    return setSelectedItems([...selectedItems, id]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { name, email, whatsapp, city, uf } = formData;
    const [latitude, longitude] = selectedMapPosition;
    const items = selectedItems.join(',');

    const data = {
      name,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
      items,
    };

    await api.post('/locations', data);
  }

  return (
    <div id="page-create-location">
      <div className="content">
        <header>
          <img src={logo} alt="Coleta Seletiva" />
          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>
            Cadastro do <br /> local de coleta
          </h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Marque o endereço no mapa</span>
            </legend>
            <Map
              center={[-23.0003709, -43.365895]}
              zoom={14}
              onclick={handleMapClick}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[selectedMapPosition[0], selectedMapPosition[1]]}
              />
            </Map>
            <div className="field-group">
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="uf">Estado</label>
                <input
                  type="text"
                  name="uf"
                  id="uf"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens coletados</h2>
              <span>Você pode marcar um ou mais ítens</span>
            </legend>
            <ul className="items-grid">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectedItem(item.id)}
                  className={`${
                    selectedItems.includes(item.id) ? 'selected' : ''
                  }`}
                >
                  <img src={item.image_url} alt={item.title} />
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar local de coleta</button>
        </form>
      </div>
    </div>
  );
};

export default CreateLocation;
