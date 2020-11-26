import LoginCommand from "../../login/LoginCommand";


/**设施*/
export class Facility {
    name: string = "";
    level:number = 0;
    type:number = 0;
}



/**设施(配置)*/
export class FacilityConfig {
    name: string = "";
    type:number = 0;
    mLevel:number = 0;
    json:any = {};
}


/**征兵基础消耗*/
export class ConscriptBaseCost {
    cost_wood: number = 0;
    cost_iron:number = 0;
    cost_stone:number = 0;
    cost_grain:number = 0;
    cost_gold:number = 0;
}


export class WarReport {
    id: number = 0;
    attack_rid:number = 0;
    defense_rid:number = 0;

    beg_attack_army:any = {};
    beg_defense_army:any = {};
    end_attack_army:any = {};
    end_defense_army:any = {};

    attack_is_win:boolean = false;
    attack_is_read:boolean = false;
    defense_is_read:boolean = false;
    destroy_durable:number = 0;
    occupy:number = 0;
    x:number = 0;
    y:number = 0;
    ctime:number = 0;
    beg_attack_general:any = {};
    beg_defense_general:any = {};

    end_attack_general:any = {};
    end_defense_general:any = {};

    is_read:boolean = false;
    
}




export default class MapUIProxy {
    protected _myFacility: any = new Map();//城市设施
    protected _facilityConfig:any = null;//设施配置
    protected _armyBaseCost:ConscriptBaseCost = new ConscriptBaseCost();
    protected _warReport:Map<number, WarReport> = new Map<number, WarReport>();



    /**
     * 当前城市的设施
     * @param data 
     */
    public setMyFacility(data:any):void {
        this._myFacility.clear();
        var cityId = data.cityId;
        var facilities = data.facilities;
        // console.log("facilities:",facilities)
        if(facilities){
            var facilitiesArr = [];
            for(var i = 0;i < facilities.length;i++){
                var obj = new Facility();
                obj.name = facilities[i].name;
                obj.level = facilities[i].level;
                obj.type = facilities[i].type;
                facilitiesArr.push(obj);
            }
            this._myFacility.set(cityId,facilitiesArr);
        }
       

    }


    /**
     * 获取当前拥有的设施
     * @param cityId 
     */
    public getMyFacility(cityId:number = 0):Array<Facility>{
        return this._myFacility.get(cityId);
    }


    public setMyFacilityByCityId(cityId:number = 0,facilitiesArr:any):void{
        this._myFacility.set(cityId,facilitiesArr);
    }


    public getMyFacilityByType(cityId:number = 0,type:number = 0):any{
        var facility = this.getMyFacility(cityId);
        if(facility){
            for(var i = 0;i < facility.length;i++){
                if(type == facility[i].type){
                    return facility[i];
                }
            }
        }
        return null;
    }


    /**
     * 全部设施配置
     * @param jsonAsset 
     */
    public setAllFacilityCfg(jsonAsset:any):void{
        this._facilityConfig = new Map();
        
        var _facilityConfig = {};
        for(var i = 0;i < jsonAsset.length;i++){
            var asset = jsonAsset[i];
            _facilityConfig[asset._name] = asset.json;
        }


        for(var i = 0; i < _facilityConfig.facility.list.length;i++){
            var obj = new FacilityConfig();
            obj.type = _facilityConfig.facility.list[i].type;
            obj.name = _facilityConfig.facility.list[i].name;
            this._facilityConfig.set(obj.type,obj);
        }


        delete _facilityConfig["facility"];

        var facility:FacilityConfig = null;
        for(var key in _facilityConfig){
            var jsonData = _facilityConfig[key];
            if(jsonData.type != undefined){
                facility = this._facilityConfig.get(jsonData.type);
                facility.json = jsonData;
                facility.mLevel = jsonData.levels.length;

                this._facilityConfig.set(jsonData.type,facility);
            }

            else{
                for(var jsonKey in jsonData){
                    if(jsonKey == "title"){
                        continue;
                    }
                    facility = this._facilityConfig.get(jsonData[jsonKey].type);
                    facility.json = jsonData[jsonKey];
                    facility.mLevel = jsonData[jsonKey].levels.length;

                    this._facilityConfig.set(jsonData[jsonKey].type,facility);
                } 
            }
        }

        _facilityConfig = null;
    }


    public getFacilityCfgByType(type:number = 0):FacilityConfig{
        return this._facilityConfig.get(type);
    }


    public setBaseCost(data:any):void{
        this._armyBaseCost.cost_gold = data.json.conscript.cost_gold;
        this._armyBaseCost.cost_iron = data.json.conscript.cost_iron;
        this._armyBaseCost.cost_wood = data.json.conscript.cost_wood;
        this._armyBaseCost.cost_grain = data.json.conscript.cost_grain;
        this._armyBaseCost.cost_stone = data.json.conscript.cost_stone;

    }

    
    public getBaseCost() : ConscriptBaseCost {
        return this._armyBaseCost;
    }
    


    public updateWarReport(data:any):void{
        var list = data.list;
        for(var i = 0;i < list.length ;i++){
            var obj = new WarReport();
            obj.id = list[i].id;
            obj.attack_rid = list[i].attack_rid;
            obj.defense_rid = list[i].defense_rid;

            obj.beg_attack_army = JSON.parse(list[i].beg_attack_army);
            obj.beg_defense_army = JSON.parse(list[i].beg_defense_army);
            obj.end_attack_army = JSON.parse(list[i].end_attack_army);
            obj.end_defense_army = JSON.parse(list[i].end_defense_army);
            obj.beg_attack_general = JSON.parse(list[i].beg_attack_general);
            obj.beg_defense_general = JSON.parse(list[i].beg_defense_general);

            obj.end_attack_general = JSON.parse(list[i].end_attack_general);
            obj.end_defense_general = JSON.parse(list[i].end_defense_general);

            obj.attack_is_win = list[i].attack_is_win;
            obj.defense_is_read = list[i].defense_is_read;
            obj.attack_is_read = list[i].attack_is_read;
            
            obj.is_read = this.isReadObj(obj);
            obj.destroy_durable = list[i].destroy_durable;
            obj.occupy = list[i].occupy;
            obj.x = list[i].x;
            obj.y = list[i].y;
            obj.ctime = list[i].ctime * 1000;

            this._warReport.set(obj.id,obj);
        }
    }



    public updateWarRead(id:number = 0,isRead:boolean = true){
        var data = this._warReport.get(id);
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        if(data){
            if(data.defense_rid == roleData.rid){
                data.defense_is_read = isRead;
                data.is_read = isRead;
            }

            if(data.attack_rid == roleData.rid){
                data.attack_is_read = isRead;
                data.is_read = isRead;
            }
            

            this._warReport.set(id,data);
        }
    }


    public isRead(id:number = 0):boolean{
        var data = this._warReport.get(id);
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        if(data){
            if(data.defense_rid == roleData.rid){
                return data.defense_is_read;
            }

            if(data.attack_rid == roleData.rid){
                return data.attack_is_read ;
            }

        }

        return false;
    }

    public isReadObj(obj:any):boolean{
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        if(obj.defense_rid == roleData.rid){
            return obj.defense_is_read;
        }

        if(obj.attack_rid == roleData.rid){
            return obj.attack_is_read ;
        }

        return false;
    }

    public getWarReport():WarReport[]{
        var arr:WarReport[] = Array.from(this._warReport.values());
        arr = arr.sort(this.sortIsRead);
        arr = arr.concat();

        var backArr:WarReport[] = [];
        for(var i = 0; i < arr.length;i++){
            if(arr[i].is_read == true){
                backArr.push(arr[i]);
                arr.splice(i,1);
                i--;
            }
        }


        backArr = backArr.concat(arr);
        backArr = backArr.reverse();
        return backArr;
    }


    public sortIsRead(a:any,b:any):number{
        if (a.id < b.id){
            return 1;
        }

        return -1;
	}


    public isReadNum():number{
        var num = 0;
        var arr = this.getWarReport();
        for(var i = 0 ;i < arr.length ;i++){
            if(!this.isRead(arr[i].id)){
                num++;
            }
        }

        return num;
    }

}