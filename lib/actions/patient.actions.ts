"use server";

import { ID, Query } from "node-appwrite"
import { InputFile} from "node-appwrite/file"
import { 
    BUCKET_ID, 
    DATABASE_ID, 
    ENDPOINT, 
    PATIENT_COLLECTION_ID, 
    PROJECT_ID, 
    databases, 
    storage, 
    users 
} from "../appwrite.config"
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(), 
            user.email, 
            user.phone, 
            undefined, 
            user.name
        );

        return parseStringify(newUser);
        
    } catch (error: any) {
        if(error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal('email', [user.email])
            ])
            
            return existingUser?.users[0]
        }
    }
}

/**
 * Retrieves a user by their ID.
 * @param userId The ID of the user to retrieve.
 * @returns The user if found, otherwise `undefined`.
 */
export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        
        return parseStringify(user);
    } catch (error) {
        console.log(error)
    }
}


/**
 * Registers a new patient.
 * @param patient The patient's information.
 * @param identificationDocument The patient's identification document.
 * @returns The newly created patient if successful, otherwise `undefined`.
 */
export const registerPatient = async ({ identificationDocument, ...patient }: 
RegisterUserParams) => {
    try {
        let file;

        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob, 
                identificationDocument?.get('fileName') as string
            );

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id ? file.$id : null,
                identificationDocumentUrl:  file?.$id
                ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
                : null,
                ...patient
            }
        )

        return parseStringify(newPatient);
    } catch (error) {
        console.log("An error occurred while creating a new patient:", error);
    }
}