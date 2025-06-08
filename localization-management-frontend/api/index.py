from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI()


@app.get("/api/localizations/{project_id}/{locale}")
async def get_localizations(project_id: str, locale: str):
    return {"project_id": project_id, "locale": locale, "localizations": {"greeting": "Hello", "farewell": "Goodbye"}}

@app.get("/api/localizations")
async def get_all_localizations():
    return supabase.table("localizations").select("*").execute()

@app.get("/localizations-by-project-id/{project_id}")
async def get_localization_by_project_id(project_id: str):
    result = supabase.table("localizations").select("*").eq("project_id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Localization not found")
    return result

@app.get("/localizations-by-project-ids")
async def get_localizations_by_project_ids(project_ids: str):
    project_id_list = [project_id.strip() for project_id in project_ids.split(",") if project_id.strip()]
    result = supabase.table("localizations").select("*").in_("project_id", project_id_list).execute()
    return result

# Pydantic models for request/response
class LocalizationUpdate(BaseModel):
    project_id: str
    locale: str
    localizations: dict  # JSON object containing key-value pairs

class BulkUpdateRequest(BaseModel):
    updates: List[LocalizationUpdate]

class BulkUpdateResponse(BaseModel):
    success: bool
    updated_count: int
    errors: List[str] = []

@app.put("/localizations/bulk-update")
async def bulk_update_localizations(request: BulkUpdateRequest):
    try:
        updated_count = 0
        errors = []
        
        for update in request.updates:
            try:
                # Direct update assuming the record exists
                result = supabase.table("localizations").update({
                    "localizations": update.localizations
                }).eq("project_id", update.project_id).eq("locale", update.locale).execute()
                
                # Check if update was successful
                if hasattr(result, 'data') and result.data is not None:
                    if len(result.data) > 0:
                        updated_count += 1
                    else:
                        errors.append(f"No record found for project {update.project_id}, locale {update.locale}")
                else:
                    errors.append(f"Failed to update localizations for project {update.project_id}, locale {update.locale}")
                    
            except Exception as e:
                errors.append(f"Error updating project {update.project_id}, locale {update.locale}: {str(e)}")
        
        return BulkUpdateResponse(
            success=len(errors) == 0,
            updated_count=updated_count,
            errors=errors
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in bulk update: {str(e)}")