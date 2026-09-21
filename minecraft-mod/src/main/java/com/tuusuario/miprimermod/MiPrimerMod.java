package com.tuusuario.miprimermod;

import com.tuusuario.miprimermod.init.ModItems;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(MiPrimerMod.MOD_ID)
public class MiPrimerMod {
    public static final String MOD_ID = "miprimermod";

    public MiPrimerMod() {
        IEventBus bus = FMLJavaModLoadingContext.get().getModEventBus();
        ModItems.ITEMS.register(bus);
    }
}
