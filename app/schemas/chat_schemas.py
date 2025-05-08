from pydantic import BaseModel, Field, validator, ConfigDict


class AnalyzeImage(BaseModel):
    img_name:str

class MappingData(BaseModel):
    components_data:list[dict]

class GenerateDocs(BaseModel):
    img_name:str
    mapped_data:list[dict]
    components_data:list[dict]
