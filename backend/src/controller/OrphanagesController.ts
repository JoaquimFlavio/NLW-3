import { Request, Response } from 'express';
import { getRepository, Index } from "typeorm";
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_views';
import * as Yup from 'yup';

// index, show, create, update, delete

export default {
    async index(request: Request, response: Response) {
        const OrphanageRepository = getRepository(Orphanage);

        const orphanages = await OrphanageRepository.find();

        return response.json(orphanages);
    },
    
    async show(request: Request, response: Response) {
        const { orphanage } = request.params;
 
        const OrphanageRepository = getRepository(Orphanage);

        const orphanages = await OrphanageRepository.findOneOrFail(orphanage, {
            relations: ['images']
        });

        return response.json(orphanageView.render(orphanages));
    },

    async create(request: Request, response: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
        } = request.body;
        
        const OrphanageRepository = getRepository(Orphanage);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        })
    
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images,
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.string().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
                })
            )
        });

        await schema.validate(data, {
            abortEarly: false,
        })

        const orphanage = OrphanageRepository.create(data);
    
        await OrphanageRepository.save(orphanage);
    
        return response.status(201).json(orphanage);
    }
}