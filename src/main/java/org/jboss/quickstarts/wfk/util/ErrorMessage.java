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
package org.jboss.quickstarts.wfk.util;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>A simple POJO to hold the details of an actual error that will be marshaled into JSON by jackson.</p>
 *
 * @author hugofirth
 */
public class ErrorMessage {
    private final String error;
    private final Map<String, String> reasons;

    public ErrorMessage(String error) {
        this.error = error;
        this.reasons = new HashMap<>();
    }

    public ErrorMessage(String error, Map<String, String> reasons) {
        this.error = error;
        this.reasons = reasons;
    }

    public Map<String, String> getReasons() {
        return reasons;
    }

    public String getError() {
        return error;
    }
}
