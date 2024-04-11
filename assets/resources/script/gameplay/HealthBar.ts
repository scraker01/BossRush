import { _decorator, Component, instantiate, Label, Node, Prefab,resources,screen, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HealthBar')
export class HealthBar extends Component {
    @property({type:Prefab}) private heroHB:Prefab;
    @property({type:Prefab}) private enemyHB:Prefab;
    
    private hbHero:Node;
    private hbBoss:Node;

    private camNode: Node;
    private url: String;

    private basePlayerHeatlh :number;
    private baseEnemyHeatlh :number;

    onLoad() {
        this.camNode = this.node.getParent().getChildByName("Camera");

        this.instatiateHeroIcon();
        this.instatiateBossIcon();
        this.restartHB();
        
    }
    
    update(deltaTime: number) {
        let canvSize = this.node.getParent().getComponent(UITransform).contentSize.x
        let hbHeroSize = this.hbHero.getComponent(UITransform).contentSize.x;
        let hbBossSize = this.hbBoss.getComponent(UITransform).contentSize.x;
   
        this.node.getParent().getComponent(UITransform).contentSize.x;
        this.hbHero.setPosition(this.camNode.getPosition().x-(canvSize/2.5), 
                                this.camNode.getPosition().y+ (canvSize/2.5-hbHeroSize/1.25));

        if(this.hbBoss.active) {
            this.hbBoss.setPosition(this.camNode.getPosition().x+(canvSize/2.5), 
                                    this.camNode.getPosition().y+(canvSize/2.5-hbHeroSize/1.25))
        }

    }

    instatiateHeroIcon(){
        this.hbHero = instantiate(this.heroHB);
        resources.load("sprite/other/avatar/PNG/Background/con1/spriteFrame", SpriteFrame, null, (err:any, spriteFrame)=> {
            let sprite:Sprite = this.hbHero.getChildByName("Icon").getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
        });
        this.node.addChild(this.hbHero);
    }

    instatiateBossIcon(){
        this.hbBoss = instantiate(this.enemyHB);
        this.hbBoss.name = "EnemyHealthBar";

        resources.load("sprite/other/avatar/PNG/Background/con23/spriteFrame", SpriteFrame, null, (err:any, spriteFrame)=> {
            let sprite:Sprite = this.hbBoss.getChildByName("Icon").getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
        });
        

        let enScale = this.hbBoss.getScale();
        this.hbBoss.setScale(new Vec3(enScale.x*-1,1,1));
        this.hbBoss.getChildByName("Icon").setScale(new Vec3(this.hbBoss.getChildByName("Icon").getScale().x,1,1));
        this.hbBoss.getChildByName("Bar").setScale(new Vec3(this.hbBoss.getChildByName("Bar").getScale().x*-1,1,1));
        this.node.addChild(this.hbBoss);

    }

    timerBossHB(){
        this.showEnemyHB();


    }

    restartHB(){
        this.hbHero.active = true;
        this.hideEnemyHB();
    }

    showEnemyHB(){
        this.hbBoss.active = true;
    }
    
    hideEnemyHB(){
        this.hbBoss.active = false;

    }

    setPlayerBaseHealth(baseHealth: number){
        this.basePlayerHeatlh = baseHealth;
    }

    setEnemyBaseHealth(baseHealth: number){
        this.baseEnemyHeatlh = baseHealth;
    }

    updateHealth(name:String, currHealth:number){
        let percHealth;
        if(name=="Player"){
            percHealth = currHealth/this.basePlayerHeatlh;
            if(percHealth*100 > 0){
                this.updateHeroHB(percHealth);
            } else{
                this.hbHero.active =false
            }
        } else if(name == "Boss"){
            percHealth = currHealth/this.baseEnemyHeatlh;
            // console.log(percHealth);
            if(percHealth*100 > 0){
                this.updateBossHB(percHealth);
            } else{
                this.hbBoss.active =false
            }
        }
        
    }

    updateBossHB(percHealth:number){
        let bossBar = this.hbBoss.getChildByName("Bar"); 
        bossBar.getComponent(Sprite).fillRange = percHealth;
        bossBar.getChildByName("Label").getComponent(Label).string = (percHealth*100) +"%";
    }

    updateHeroHB(percHealth:number){
        let heroBar = this.hbHero.getChildByName("Bar"); 
        heroBar.getComponent(Sprite).fillRange = percHealth;
        heroBar.getChildByName("Label").getComponent(Label).string = (percHealth*100) +"%";
    }


    
}


