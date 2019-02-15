/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jboss.quickstarts.wfk.area;

import java.io.Serializable;

/**
 * <p>Simple POJO representing AreaCode objects</p>
 *
 * @author hugofirth
 */
public class Area implements Serializable {

    private static final long serialVersionUID = 249872301293L;

    private int id;
    private String state;
    private String abbr;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getAbbr() {
        return abbr;
    }

    public void setAbbr(String abbr) {
        this.abbr = abbr;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Area)) return false;

        Area area = (Area) o;

        if (id != area.id) return false;
        if (!state.equals(area.state)) return false;
        return abbr.equals(area.abbr);

    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + state.hashCode();
        result = 31 * result + abbr.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "Area{" +
                "id=" + id +
                ", state='" + state + '\'' +
                ", abbr='" + abbr + '\'' +
                '}';
    }
}
